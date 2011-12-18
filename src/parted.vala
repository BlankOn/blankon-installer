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
    string send_command (string command) {
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

    public ArrayList<InstallDevice> get_devices () {
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
