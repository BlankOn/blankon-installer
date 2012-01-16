using Gee;


public class ZPartition : Object {
    public enum MSDosType {
        PRIMARY,
        LOGICAL,
        EXTENDED
    }

    const string tmp_mount = "/tmp/tmp-mount";
    const string[] supported_fs = { "ext3", "ext2", "ext4", "reiserfs", "xfs", "btrfs" };
    const string[] releases = { "/etc/lsb-release" };


    static HashMap <string,string> probed_os = new HashMap<string,string>();
    public int number { get; set construct; }
    public long start { get; set construct; }
    public long end { get; set construct; }
    public long size { get; set construct; }
    public string filesystem { get; set construct; }
    public string flag { get; set construct; }
    public int parent { get; set construct; }
    public string description { get; set construct; }

    string peek_description (string device) {
        var result = "";
        if (probed_os.size == 0) {
            string normal_output;
            string error_output;
            int status;

            
            string[] args = { "/usr/bin/os-prober" };
            string[] env = { "LC_ALL=C" };

            try {
    		    Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out normal_output, out error_output, out status);
            } catch (GLib.Error e) {
            }

            stdout.printf("------>%s<", normal_output);
            foreach (var line in normal_output.split("\n")) {
                var fields = line.split(":");
                if (fields.length > 1) {
                    probed_os.set (fields[0], fields[1]);
                }
            }

        }

        result = probed_os [device];

        return result;
    }

    // Sample: 1:32,3kB:1045MB:1045MB:ext4::boot
    public ZPartition.from_parted_string(string line, string device, int last_partition, long last_start, long last_end) {
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
            description = peek_description (device);
        }
    }

    public ZPartition.from_unallocated_space(string device, long size) {
        number = 1;
        filesystem = "free";
        this.size = size;
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


    public InstallDevice.from_unallocated_space(string device, long size) {
        path = device;
        this.size = size;
        model = "Unknown";
        controller = "unknown";
        partitions = new ArrayList<Partition>();
        //partitions.add (new Partition.from_unallocated_space(device, size));
    }

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

            /* if (step == 2) {  // Get partition info

                //var partition = new Partition.from_parted_string (line, path, last_partition, last_parent_start, last_parent_end);
                partitions.add(partition);
                if (partition.parent == 0) {
                    last_partition = partition.number;
                    last_parent_start = partition.start;
                    last_parent_end = partition.end;
                }
            }
            */
        }
    }
}

public class Partition : Object {
    public enum PartitionType {
        NORMAL,
        LOGICAL,
        EXTENDED,
        FREESPACE,
        METADATA,
        PROTECTED
    }

    public int number { get; set construct; }
    public long start { get; set construct; }
    public long end { get; set construct; }
    public long size { get; set construct; }
    public string filesystem { get; set construct; }
    public string flag { get; set construct; }
    public int parent { get; set construct; }
    public string description { get; set construct; }
    public PartitionType ptype { get; set construct; }

    public Partition (int number, long start, long end, long size, string filesystem, string flag, string description, PartitionType type) {
        this.number = number;
        this.start = start;
        this.end = end;
        this.size = size;
        this.filesystem = filesystem;
        this.flag = flag;
        this.description = description;
        this.parent = parent;
        this.ptype = type;
    }
}


public class Device : Object {
    Ped.Device? device;
    public Ped.Disk? disk;
    bool valid;
    public ArrayList<Partition> partitions { get; set construct; }  

    public bool is_valid () {
        return valid;
    }

    public Device (string s) {
        partitions = new ArrayList<Partition>();
        device = new Ped.Device (s);
        if (device != null) {
            valid = true;
        }
        disk = new Ped.Disk.from_device (device);
        if (disk != null) {
            Ped.Partition? p = disk.part_list;
            while ((p = disk.next_partition (p)) != null) {
                if (p.num < 1)
                    continue;
    
                stdout.printf("%d\n", p.num);
                var fs = "";
                if (p.fs_type != null) {
                    fs = p.fs_type.name;
                }
                var flag = "";
                var description = "";
                Partition.PartitionType type = Partition.PartitionType.NORMAL;
                switch (p.type) {
                case Ped.PartitionType.NORMAL:
                    type = Partition.PartitionType.NORMAL;
                    break;
                case Ped.PartitionType.LOGICAL:
                    type = Partition.PartitionType.LOGICAL;
                    break;
                case Ped.PartitionType.EXTENDED:
                    type = Partition.PartitionType.EXTENDED;
                    break;
                case Ped.PartitionType.FREESPACE:
                    type = Partition.PartitionType.FREESPACE;
                    break;
                case Ped.PartitionType.METADATA:
                    type = Partition.PartitionType.METADATA;
                    break;
                case Ped.PartitionType.PROTECTED:
                    type = Partition.PartitionType.PROTECTED;
                    break;
                default:
                    type = Partition.PartitionType.NORMAL;
                    break;
                }

                Partition new_p = new Partition (p.num, 
                                                (long) p.geom.start,
                                                (long) p.geom.end,
                                                (long) p.geom.length,
                                                fs,
                                                flag,
                                                description,
                                                type); 
                partitions.add (new_p);
            }
        }
    }

    public string get_path () {
        if (!valid)
            return "";

        return device.path;
    }

    public string get_model () { 
        if (!valid)
            return "";

        return device.model;
    }
    
    public long get_size () {
        if (!valid)
            return 0;

        return (long) device.length;
    }

    public string get_label () { 
        if (!valid)
            return "";

        return disk.type.name;
    }

    public int get_num_partitions () {
        if (!valid)
            return 0;

        return disk.get_last_partition_num ();
    }

}

public class Parted {

    const string[] invalid_devices = { "loop", "dm" };

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
        string stdout = "";
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

    public static ArrayList<Device> get_devices () {
        var retval = new ArrayList<Device> ();
        HashMap<string,long> devices = new HashMap<string,long>();
        ////devices.set ("/tmp/a.img", 4000000);
        //devices.add("/tmp/b.img");
        //var output = "";
        
        var output = probe ();
        //var output = ""; 
        foreach (var line in output.split("\n")) {
            if (line.length == 0)
                continue;

            devices.set (line.split(": ")[0], 0);
        }

        // Traverse again in /proc/partitions in case no disk reported by partprobe 
        if (devices.size == 0) {
            var file = File.new_for_path ("/proc/partitions");

            if (!file.query_exists ()) {
                stderr.printf ("File '%s' doesn't exist.\n", file.get_path ());
                return retval;
            }

            try {
                var dis = new DataInputStream (file.read ());
                string line;
                int i = 0;
                while ((line = dis.read_line (null)) != null) {
                    if (i < 2) { // Data starts at line 3
                        i ++;
                        continue;
                    }

                    var data = "";
                    var column = 0;
                    long block_size = 0;
                    var device_name = "";
                    for (var j = 0; j < line.length; j ++) {
                        if (line [j] == ' ') { 
                            if (data != "") { // data already contain something
                                if (column == 2) { // interesting data starts at column #3
                                    block_size = long.parse (data);
                                    data = "";
                                } else if (column == 3) {
                                    device_name = data;
                                    data = "";
                                }
                                data = "";
                                column ++;
                            }
                            continue; // skip space
                        } else {
                            if (column == 3 && line[j].isdigit()) {
                                data = "";
                                device_name = "";
                                break;
                            }
                            data += line [j].to_string();
                        }
                    }
                    if (data != "") {
                        device_name = data;
                    }
                    bool insert = false;
                    foreach (var d in invalid_devices) {
                        if (device_name.has_prefix (d)) {
                            break;
                        } else {
                            insert = true;
                        }
                    }
                    if (int.parse (device_name) > 0)
                        insert = false;

                    if (insert && device_name.length > 0) {
                        devices.set ("/dev/" + device_name, block_size);
                    }
                }
            } catch (Error e) {
                error ("%s", e.message);
            }

        }


        Ped.Utils.set_default_unit(Ped.Unit.BYTE);
        foreach (var device in devices.keys) {
            Device d = new Device (device);
            retval.add (d);
            /*
            output = send_command (device, "print free");

            stdout.printf("->%s<-: %d\n", output, output.length);

            InstallDevice d;
            if (output.length == 0 || output.has_prefix("Error")) {
                if (devices [device] == 0L)
                    continue;
                d = new InstallDevice.from_unallocated_space (device, devices [device]);
            } else {
                d = new InstallDevice.from_parted_string (output);
            }

            retval.add (d);
            */
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
            retval += " { 'path' : '" + device.get_path () + "',\n";
            retval += " 'size' : " + device.get_size ().to_string() + ",\n";
            retval += " 'model' : '" + device.get_model () + "',\n";
            retval += " 'label' : '" + device.get_label () + "',\n";
            retval += " 'partitions' : [\n";
            need_comma = false;
            if (device.partitions != null) {
                foreach  (var partition in device.partitions) {
                    
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
