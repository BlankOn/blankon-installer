using Gee;

public class Partition : Object {
    public enum MSDosType {
        PRIMARY,
        LOGICAL,
        EXTENDED
    }

    const string tmp_mount = "/tmp/tmp-mount";
    const string[] supported_fs = { "ext3", "ext2", "ext4", "reiserfs", "xfs", "btrfs" };
    const string[] releases = { "/etc/lsb-release" };

    public int number { get; set construct; }
    public long start { get; set construct; }
    public long end { get; set construct; }
    public long size { get; set construct; }
    public string filesystem { get; set construct; }
    public string flag { get; set construct; }
    public int parent { get; set construct; }
    public string description { get; set construct; }

    string peek_description_from_release (string release_file) {
        var result = "";
        var file = File.new_for_path (tmp_mount + release_file);

        if (!file.query_exists ()) {
            stderr.printf ("File '%s' doesn't exist.\n", file.get_path ());
            return "";
        }

        try {
            var dis = new DataInputStream (file.read ());
            string line;
            // Read lines until end of file (null) is reached
            while ((line = dis.read_line (null)) != null) {
                if (line.has_prefix ("DISTRIB_DESCRIPTION")) {
                    var split = line.split("=");
                    if (split.length > 1) {
                        result = split [1].replace("\"", "").replace("'", "");
                        return result;
                    }
                }
                result = line;
            }
        } catch (Error e) {
            error ("%s", e.message);
        }
        return result;
    }

    string peek_description () {
        var result = "";
        foreach (var file in releases) {
            result = peek_description_from_release (file);
            if (result != "");
                return result;
        }
        return result;
    }

    // Sample: 1:32,3kB:1045MB:1045MB:ext4::boot
    public Partition.from_parted_string(string line, string device, int last_partition, long last_start, long last_end) {
        var fields  = line.split(":");
        number      = int.parse(fields [0]);
        start       = int.parse(fields [1]);
        end         = int.parse(fields [2]);
        size        = int.parse(fields [3]);
        filesystem  = fields [4];
        if (fields.length > 5) {
            flag    = fields [6];
        } else {
            flag    = "";
        }

        if (start >= last_start && end <= last_end) {
            parent = last_partition;
        } else {
            parent = 0;
        }

        if (filesystem.has_prefix ("linux-swap")) {
            description = "Swap";
        } else {
            Posix.mkdir (tmp_mount, 0700);
            if (filesystem in supported_fs) {
                stdout.printf("Mounting %s\n", (device + fields[0]));
                if (Linux.mount (device + fields [0], tmp_mount, filesystem) == 0) {
                    description = peek_description ();
                    Linux.umount (tmp_mount); 
                }
            }
        }
        Posix.rmdir (tmp_mount);
    }
}

public class InstallDevice : Object {
    public string path { get; set construct; }
    public string model { get; set construct; }
    public long size { get; set construct; }
    public string controller { get; set construct; }
    public long sector_size_logical { get; set construct; }
    public long sector_size_physical { get; set construct; }
    public string label { get; set construct; }
    public ArrayList<Partition> partitions { get; set construct; }

    public InstallDevice.from_parted_string(string lines) {
        int step = 0;
        int last_partition = 0;
        long last_parent_start = 0;
        long last_parent_end = 0;
        foreach (var line in lines.split(";\n")) {
            if (line.length == 0)
                continue;

            if (line == "BYT") {
                step = 1;
                continue;
            }
          
            // /dev/sda:1000GB:scsi:512:512:msdos:ATA WDC WD10EADS-00L;
            if (step == 1) {  // Get device info
                var fields = line.split(":");
                path = fields [0];
                size = long.parse(fields [1]);
                controller = fields [2];
                sector_size_logical = long.parse(fields [3]);
                sector_size_physical = long.parse(fields [4]);
                label = fields [5];
                model = fields [6];
                partitions = new ArrayList<Partition>();
                step ++;
                continue;
            }

            if (step == 2) {  // Get partition info
                var partition = new Partition.from_parted_string (line, path, last_partition, last_parent_start, last_parent_end);
                partitions.add(partition);
                if (partition.parent == 0) {
                    last_partition = partition.number;
                    last_parent_start = partition.start;
                    last_parent_end = partition.end;
                }
            }
        }
    }
}

public class Parted {

    static string probe () {
        string stdout;
        string stderr;
        int status;
        string[] args = { "/sbin/partprobe", "-s" };
        string[] env = { "LC_ALL=C" };

        try {
    		Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out stdout, out stderr, out status);
        } catch (GLib.Error e) {
            throw e;
        }

        return stdout;
    }

    static string send_command (string device, string command) {
        string stdout;
        string stderr;
        int status;
        string[] args = { "/sbin/parted", "-m", "-s", device, "unit MB", command };
        string[] env = { "LC_ALL=C" };

        try {
    		Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out stdout, out stderr, out status);
        } catch (GLib.Error e) {
            throw e;
        }

        return stdout;
    }

    public static ArrayList<InstallDevice> get_devices () {
        ArrayList<string> devices = new ArrayList<string>();
        devices.add("/tmp/a.img");
        devices.add("/tmp/b.img");
        var output = "";
        /*
        var output = probe ();
        foreach (var line in output.split("\n")) {
            if (line.length == 0)
                continue;

            devices.add (line.split(": ")[0]);
        }*/

        var retval = new ArrayList<InstallDevice> ();

        foreach (var device in devices) {
            output = send_command (device, "print free");

            stdout.printf("%s\n", output);
            if (output.length == 0)
                continue;

            var d = new InstallDevice.from_parted_string (output);
            retval.add (d);
        }

        return retval;
    }

    public static string get_devices_json() {
        string retval = "";
        var list = get_devices ();
        bool need_comma = false;
        retval += "[\n";
        foreach (var device in list) {
            if (need_comma) retval += ",\n";
            retval += " { 'path' : '" + device.path + "',\n";
            retval += " 'size' : " + device.size.to_string() + ",\n";
            retval += " 'controller' : '" + device.controller + "',\n";
            retval += " 'model' : '" + device.model + "',\n";
            retval += " 'label' : '" + device.label + "',\n";
            retval += " 'partitions' : [\n";
            need_comma = false;
            foreach (var partition in device.partitions) {
                if (need_comma) retval += ",\n";
                retval += "     {\n";
                retval += "     'id': " + partition.number.to_string() + ",\n";
                retval += "     'parent': " + partition.parent.to_string() + ",\n";
                retval += "     'start': " + partition.start.to_string() + ",\n";
                retval += "     'end': " + partition.end.to_string() + ",\n";
                retval += "     'size': " + partition.size.to_string() + ",\n";
                retval += "     'filesystem': '" + partition.filesystem + "',\n";
                retval += "     'description': '" + partition.description + "',\n";
                retval += "     }\n";
                need_comma = true;
            }
            retval += " ]\n";
            retval += "}\n";
            need_comma = true;
        }
        retval += "]";
        return retval;
    }

    public static string process_request (string uri) {
        var reqs = uri.split("parted/");
        if (reqs [1] == "get_devices") {
        stdout.printf("%s\n", reqs[1]);
            return get_devices_json();
        }
        return "{}";
    }

    public Parted () {
    }

}

/*
int main (string[] args) {
    var xp = new Parted();
    var o = xp.get_devices();
    foreach (var i in o) {
        stdout.printf("> %s %ld\n\n", i.model, i.size);
        foreach (var p in i.partitions) {
            stdout.printf(">%d %ld\n", p.number, p.size);
        }
    }
    return 0;
}*/
