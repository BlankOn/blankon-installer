using Gee;


public class Partition : Object {
    public enum MSDosType {
        PRIMARY,
        LOGICAL,
        EXTENDED
    }

    public int number { get; set construct; }
    public long start { get; set construct; }
    public long end { get; set construct; }
    public long size { get; set construct; }
    public string filesystem { get; set construct; }
    public string flag { get; set construct; }

    // Sample: 1:32,3kB:1045MB:1045MB:ext4::boot
    public Partition.from_parted_string(string line) {
        var fields  = line.split(":");
        number      = int.parse(fields [0]);
        start       = int.parse(fields [1]);
        end         = int.parse(fields [2]);
        size        = int.parse(fields [3]);
        filesystem  = fields [4];
        flag        = fields [6];
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
                var partition = new Partition.from_parted_string (line);
                partitions.add(partition);
            }
        }
    }
}

public class Parted {
    static string send_command (string command) {
        string stdout;
        string stderr;
        int status;
        string[] args = { "/sbin/parted", "-m", "-s", "-l", "unit MB", command };

        try {
    		Process.spawn_sync ("/tmp", args, null,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out stdout, out stderr, out status);
        } catch (GLib.Error e) {
            throw e;
        }

        return stdout;
    }

    public static ArrayList<InstallDevice> get_devices () {
        var retval = new ArrayList<InstallDevice> ();
        var output = send_command ("print");

        foreach (var line in output.split("\n\n")) {
            if (line.length == 0)
                continue;
            var device = new InstallDevice.from_parted_string (line);
            retval.add (device);
        }

        return retval;
    }

    public static string get_devices_json() {
        string retval = "";
        var list = get_devices ();
        bool need_comma = false;
        foreach (var device in list) {
            if (need_comma) retval += ",\n";
            retval += "{\n";
            retval += "'" + device.path + "': {\n";
            retval += " 'size' : " + device.size.to_string() + ",\n";
            retval += " 'controller' : '" + device.controller + "',\n";
            retval += " 'model' : '" + device.model + "',\n";
            retval += " 'label' : '" + device.label + "',\n";
            retval += " 'partitions' : {\n";
            need_comma = false;
            foreach (var partition in device.partitions) {
                if (need_comma) retval += ",\n";
                retval += "     '" + partition.number.to_string() + "': \n";
                retval += "     {\n";
                retval += "     'start': " + partition.start.to_string() + ",\n";
                retval += "     'end': " + partition.end.to_string() + ",\n";
                retval += "     'size': " + partition.size.to_string() + ",\n";
                retval += "     'filesystem': '" + partition.filesystem + "',\n";
                retval += "     }\n";
                need_comma = true;
            }
            retval += "} \n";
            retval += " }\n";
            retval += "}\n";
            need_comma = true;
        }
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
