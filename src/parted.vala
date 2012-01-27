using Gee;
using JSCore;

public class OsProber {
    static HashMap<string,string> probes;

    static void reget () {

        probes = new HashMap<string,string> ();
        string normal_output;
        string error_output;
        int status;
        string[] args = { "/usr/bin/os-prober" };
        string[] env = { "LC_ALL=C" };


        try {
            Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out normal_output, out error_output, out status);
        } catch (GLib.Error e) {
        }

        foreach (var line in normal_output.split("\n")) {
            var fields = line.split(":");
            if (fields.length > 1) {
                probes.set (fields[0], fields[1]);
            }
        }
    }

    public static string get_description (string partition) {
        if (probes == null)
            reget ();
        var s = probes.get (partition);
        if (s == null) {
            reget ();
            s = probes.get (partition);
        }
        if (s == null) {
            s = "";
        }
        return s;
    }
}

public errordomain DeviceError {
    CANT_CREATE_PARTITION
}

public class Partition : GLib.Object {
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


public class Device : GLib.Object {
    uint64 unit_size = 1;
    static bool need_free = false;
    Ped.Device? device;
    Ped.Disk? disk;
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
                var fs = "";
                if (p.fs_type != null) {
                    fs = p.fs_type.name;
                }
                var flag = "";
                var description = "";
                if (p.num > 0) {
                    description = OsProber.get_description (device.path + p.num.to_string());
                }
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
                    if (p.num == -1) {
                        type = Partition.PartitionType.FREESPACE;
                    } else {
                        type = Partition.PartitionType.NORMAL;
                    }
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
            if (partitions.is_empty) {
                Partition new_p = new Partition (-1, 0, get_size () - 1, get_size () -1, "", "", "", Partition.PartitionType.FREESPACE);
                partitions.add (new_p);
            }
        } else {
            Partition new_p = new Partition (-1, 0, get_size () -1 , get_size () -1, "", "", "", Partition.PartitionType.FREESPACE);
            partitions.add (new_p);
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

        if (device.model.length > 0) {
            return device.model;
        } else {
            return "Unknown model";
        }
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


    public void commit_changes () {
        if (!valid)
            return;

        if (disk != null) {
            stdout.printf ("Label committed\n");
            disk.commit_to_dev ();
            stdout.printf ("Label committed\n");
            disk.commit_to_os ();
            stdout.printf ("Label committed\n");
        }
    }

    // \brief Create a partition 
    //
    // Partition is created either inside a new extended partition
    // or as a new logical partition. The partition list will be
    // rebuilt.
    public int create_partition (uint64 byte_start, uint64 byte_end, string fs) throws DeviceError {
        if (device == null) {
            throw new DeviceError.CANT_CREATE_PARTITION ("Invalid device"); 
        }

        if (byte_end <= byte_start) {
            throw new DeviceError.CANT_CREATE_PARTITION ("byte_end <= byte_start: %ld < %ld\n", (long) byte_end, (long)byte_start);
        }

        bool create_extended = false;
        bool create_logical = false; // Logical partition only created whenever
                                     // extended partition is also created or 
                                     // the candidate partition is inside an extended partition,
                                     // otherwise we create primary partition
                                     // which is limited to 4 partitions per device

        bool has_extended = false;
        foreach (var p in partitions) {
            if (p.ptype == Partition.PartitionType.EXTENDED) {
                has_extended = true;
            } 

            if (byte_start < p.start) {
                // partitions are already sorted so
                // if byte_start is less than this partition's start,
                // it means that it should be realigned to the partition's
                // start offset
                byte_start = p.start;
            }

            if (byte_start >= p.start && byte_end <= p.end) {
                // it means the candidate partition is within
                // this partition. 
                // This partition must be EXTENDED or FREESPACE
                // in order to be successful
                if (!(p.ptype == Partition.PartitionType.EXTENDED ||
                      p.ptype == Partition.PartitionType.FREESPACE)) {
                    throw new DeviceError.CANT_CREATE_PARTITION ("Partition to be created is inside another partition which is not an EXTENDED nor a FREE partition. %d\n", (int) p.ptype);
                }

                if (p.ptype == Partition.PartitionType.FREESPACE) {
                    if (has_extended == false) {
                        create_extended = true;
                    }
                    create_logical  = true;
                } else if (p.ptype == Partition.PartitionType.EXTENDED) {
                    create_logical = true;
                }
                break; // skip other partitions
            } 
                

            // If it's ourside the iterating partition, then continue
        }

        if (has_extended && create_extended) {
            // EXTENDED partition already exist somewhere outside candidate's boundary
            if (partitions.size > 3) {
                // We can't make any more partitions
                throw new DeviceError.CANT_CREATE_PARTITION ("No more partitions can be created\n");
            }
            create_extended = false;
        }

        // At this point we will reset the partition list;
        // This will recreate the disk if the device is totally empty
        if (disk == null) {
            disk = new Ped.Disk (device, new Ped.DiskType("msdos"));
            stdout.printf ("Label created\n");
            if (disk != null) {
                disk.commit_to_dev ();
            }
        }


        Ped.Partition new_partition = null;
        Ped.FileSystemType fs_type = new Ped.FileSystemType(fs);
        Ped.Sector start = (Ped.Sector) (byte_start / get_unit_size ());
        Ped.Sector end  = (Ped.Sector) (byte_end / get_unit_size ());

        if (create_logical) {
            if (create_extended) {
                stdout.printf ("Creating extended partition\n");
                var ext_fs = new Ped.FileSystemType("ext3");
                var ext = new Ped.Partition(disk, Ped.PartitionType.EXTENDED, ext_fs, start, end);
                stdout.printf ("Extended partition %s%d\n", get_path(), ext.num);
                disk.add_partition (ext, new Ped.Constraint.any (device));
                disk.commit_to_dev ();
                if (ext == null) {
                    throw new DeviceError.CANT_CREATE_PARTITION ("Can't create extended partition\n");
                }
            }
            new_partition = new Ped.Partition(disk, Ped.PartitionType.LOGICAL, fs_type, start, end);
        } else {
            new_partition = new Ped.Partition(disk, Ped.PartitionType.NORMAL, fs_type, start, end);
        }
        if (new_partition != null) {
            var part_num = disk.add_partition (new_partition, new Ped.Constraint.any (device));
            if (part_num == 0) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Unable to create partition\n");
            }
            new Ped.FileSystem.create (new_partition.geom, fs_type, null);

            disk.commit_to_dev ();
            disk.commit_to_os ();
            return new_partition.num;
        } else {
            throw new DeviceError.CANT_CREATE_PARTITION ("Unable to create partition\n");
        }
    }
}

public class Parted {
    static ArrayList<Device> device_list;

    public static ArrayList<Device> get_devices (bool from_cache) {
        if (from_cache == true) {
            return device_list;
        }

        device_list = new ArrayList<Device> ();
        HashMap<string,long> devices = new HashMap<string,long>();
        //devices.set ("/tmp/a.img", 4000000);
        //devices.add("/tmp/b.img");
        Device? d = null;
        while (true) {
            d = new Device.from_list (d);
            if (d.is_valid () == false) {
                break;
            }
            if (!d.get_path ().has_prefix ("/dev/sr")) {
                device_list.add (d);
            }
        }

        foreach (var device in devices.keys) {
            d = new Device.from_name (device);
            if (d.is_valid ()) {
                device_list.add (d);
            }
        }

        return device_list;
    }

    public static string get_devices_json() {
        string retval = "";
        var list = get_devices (false);
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

    public static JSCore.Value js_get_devices (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        var s = new String.with_utf8_c_string (get_devices_json ());
        return new JSCore.Value.string (ctx, s);
    }
    
    static const JSCore.StaticFunction[] js_funcs = {
        { "getDevices", js_get_devices, PropertyAttribute.ReadOnly },
        { null, null, 0 }
    };

    static const ClassDefinition js_class = {
        0,
        ClassAttribute.None,
        "Parted",
        null,

        null,
        js_funcs,

        null,
        null,

        null,
        null,
        null,
        null,

        null,
        null,
        null,
        null,
        null
    };

    public static void setup_js_class (GlobalContext context) {
        var c = new Class (js_class);
        var o = new JSCore.Object (context, c, context);
        var g = context.get_global_object ();
        var s = new String.with_utf8_c_string ("Parted");
        g.set_property (context, s, o, PropertyAttribute.None, null);
    }
}

