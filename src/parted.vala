using Gee;

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
    public uint64 start { get; set construct; }
    public uint64 end { get; set construct; }
    public uint64 size { get; set construct; }
    public string filesystem { get; set construct; }
    public string flag { get; set construct; }
    public int parent { get; set construct; }
    public string description { get; set construct; }
    public PartitionType ptype { get; set construct; }

    public Partition (int number, uint64 start, uint64 end, uint64 size, string filesystem, string flag, string description, PartitionType type) {
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
    uint64 unit_size = 1;
    static bool need_free = false;
    Ped.Device? device;
    public Ped.Disk? disk;
    bool valid;
    public ArrayList<Partition> partitions { get; set construct; }  

    public bool is_valid () {
        return valid;
    }

    ~Device () {
        if (need_free) {
        }
    }

    public Device () {
    }

    public Device.from_list (Device? start) {
        if (need_free == false) {
            Ped.Device.probe_all ();
            need_free = true;
        }
        Ped.Device? d = null;
        if (start != null) {
            d = start.device;
        }
        device = new Ped.Device.from_list (d) ;
        init ();
    }

    public Device.from_name (string s) {
        device = new Ped.Device.from_name (s);
        init ();
    }

    void init () {
        partitions = new ArrayList<Partition>();
        if (device != null) {
            valid = true;
        } else {
            return;
        } 

        unit_size = Ped.Utils.get_unit_size(device, Ped.Unit.SECTOR);
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
                                                (uint64) p.geom.start * unit_size,
                                                (uint64) p.geom.end * unit_size,
                                                (uint64) p.geom.length * unit_size,
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
    
    public uint64 get_size () {
        if (!valid)
            return 0;

        return (uint64) device.length * unit_size;
    }

    public string get_label () { 
        if (!valid)
            return "";

        if (disk == null)
            return "";

        return disk.type.name;
    }

    public int get_num_partitions () {
        if (!valid)
            return 0;

        return disk.get_last_partition_num ();
    }

    public uint64 get_unit_size () {
        return unit_size;
    }
}

public class Parted {
    public static ArrayList<Device> get_devices () {
        var retval = new ArrayList<Device> ();
        HashMap<string,long> devices = new HashMap<string,long>();
        //devices.set ("/tmp/a.img", 4000000);
        //devices.add("/tmp/b.img");
        Device? d = null;
        while (true) {
            d = new Device.from_list (d);
            if (d.is_valid () == false) {
                break;
            }
            retval.add (d);
        }

        foreach (var device in devices.keys) {
            d = new Device.from_name (device);
            if (d.is_valid ()) {
                retval.add (d);
            }
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
                    retval += "     'type': '" + partition.ptype.to_string() + "',\n";
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
            return get_devices_json();
        }
        return "{}";
    }

    public Parted () {
    }

}


