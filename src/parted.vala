using Gee;
using JSCore;


// EfiCollector
// collects all EFI partitions in the system
public class EfiCollector {
    static ArrayList<string> efi;

    static void reget () {
        efi = new ArrayList<string> ();
        string normal_output;
        string error_output;
        int status;
        string[] args = { "/sbin/fdisk", "-l" };
        string[] env = { "LC_ALL=C" };


        try {
            Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out normal_output, out error_output, out status);
        } catch (GLib.Error e) {
        }

        foreach (var line in normal_output.split("\n")) {
            if ((line.index_of ("/dev/") == 0)
                && (line.index_of ("EFI") > 0)) {
                efi.add (line.split (" ", 2)[0]);
            }
        }
    }

    public static bool is_efi (string partition) {
        if (efi == null) {
            reget ();
        }
        return efi.contains (partition); 
    }

    public static ArrayList<string> get_partitions () {
        if (efi == null) {
            reget ();
        }
        return efi;
    }

    public static void reset () {
        reget (); 
    } 

    public static bool is_efi_system () {
        return FileUtils.test ("/sys/firmware/efi", FileTest.IS_DIR);
    }

    public static bool need_format (string partition) {
        var retval = false;
        if (is_efi (partition)) {
            string normal_output;
            string error_output;
            int status;
            string[] args = { "/sbin/blkid", partition };
            string[] env = { "LC_ALL=C" };


            try {
                Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out normal_output, out error_output, out status);
            } catch (GLib.Error e) {
            }

            foreach (var line in normal_output.split("\n")) {
                if (line.index_of (" TYPE=") > 0) {
                    retval = true;
                }
            }
        }

        return retval;
    }

}
public class SwapCollector {
    static ArrayList<string> swaps;

    static void reget () {
        swaps = new ArrayList<string> ();
        string normal_output;
        string error_output;
        int status;
        string[] args = { "/sbin/fdisk", "-l" };
        string[] env = { "LC_ALL=C" };


        try {
            Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out normal_output, out error_output, out status);
        } catch (GLib.Error e) {
        }

        foreach (var line in normal_output.split("\n")) {
            if ((line.index_of ("/dev/") == 0)
                && (line.index_of ("Linux swap") > 0)) {
                swaps.add (line.split (" ", 2)[0]);
            }
        }
    }

    public static bool is_swap (string partition) {
        if (swaps == null) {
            reget ();
        }
        return swaps.contains (partition); 
    }

    public static ArrayList<string> get_partitions () {
        if (swaps == null) {
            reget ();
        }
        return swaps;
    }

    public static void reset () {
        reget (); 
    } 

}

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


public class Device : GLib.Object {
    uint64 unit_size = 1;
    static bool need_free = false;
    Ped.Device? device;
    Ped.Disk? disk;
    bool valid;
    bool emptyLabel = false;
    public ArrayList<Partition> partitions { get; set construct; }  

    public enum PartitionType {
        NORMAL,
        LOGICAL,
        EXTENDED,
        FREESPACE,
        METADATA,
        PROTECTED,
        INVALID
    }

    public class Partition : GLib.Object {
        public int number { get;  set; }
        public uint64 start { get;  set; }
        public uint64 end { get;  set; }
        public uint64 size { get;  set; }
        public string filesystem { get;  set; }
        public string flag { get;  set; }
        public int parent { get;  set; }
        public string description { get;  set; }
        public PartitionType ptype { get;  set; }

        public Ped.Partition? internal;

        public Partition () {
            number = -1;
            start = -1;
            end = -1;
            size = -1;
            filesystem = "";
            flag = "";
            description = "";
            parent = -1;
            ptype = PartitionType.INVALID;
            internal = null;
        }

        public Partition.blank_with_size (uint64 size) {
            this.number         = -1; 
            this.start          = 0;
            this.end            = size;
            this.size           = size;
            this.filesystem     = "";
            this.flag           = "";
            this.description    = "";
            this.parent         = 0;
            this.ptype          = PartitionType.FREESPACE;
            internal = null;
        }
    }

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
                    //description = OsProber.get_description (device.path + p.num.to_string());
                }
                PartitionType type = PartitionType.NORMAL;
                switch (p.type) {
                case Ped.PartitionType.NORMAL:
                    type = PartitionType.NORMAL;
                    break;
                case Ped.PartitionType.LOGICAL:
                    type = PartitionType.LOGICAL;
                    break;
                case Ped.PartitionType.EXTENDED:
                    type = PartitionType.EXTENDED;
                    break;
                case Ped.PartitionType.FREESPACE:
                    type = PartitionType.FREESPACE;
                    break;
                case Ped.PartitionType.METADATA:
                    type = PartitionType.METADATA;
                    break;
                case Ped.PartitionType.PROTECTED:
                    type = PartitionType.PROTECTED;
                    break;
                default:
                    if (p.num == -1) {
                        type = PartitionType.FREESPACE;
                    } else {
                        type = PartitionType.NORMAL;
                    }
                    break;
                }

                Partition new_p     = new Partition ();
                new_p.number        = p.num;
                new_p.start         = (uint64) p.geom.start * unit_size;
                new_p.end           = (uint64) p.geom.end * unit_size;
                new_p.size          = (uint64) p.geom.length * unit_size;
                new_p.filesystem    = fs;
                new_p.flag          = flag;
                new_p.description   = description;
                new_p.ptype         = type; 
                new_p.internal      = p;
                partitions.add (new_p);
            }
            if (partitions.is_empty) {
                Partition new_p     = new Partition.blank_with_size (get_size () - 1);
                partitions.add (new_p);
            }
        } else {
            emptyLabel = true;
            Ped.DiskType diskType = new Ped.DiskType("gpt");
            disk = new Ped.Disk(device, diskType);
            Partition new_p     = new Partition.blank_with_size (get_size () - 1);
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

        int retval = 0;
        Ped.Partition? p = null;
        while ((p = disk.next_partition (p)) != null) {
            if (p.num >= 0) retval ++;
        }
        return retval;
    }

    public uint64 get_unit_size () {
        return unit_size;
    }


    public void commit_changes () {
        if (!valid)
            return;

        if (disk != null) {
            disk.commit_to_dev ();
            disk.commit_to_os ();
        }
    }
    
    public uint64 initialize_esp_bios_grub () {
        bool is_gpt = (disk.type.name == "gpt");
        // if this is an uefi system and there is  no partition
        ArrayList<string> efi_partitions = EfiCollector.get_partitions ();
        if ((EfiCollector.is_efi_system () && efi_partitions.is_empty) || emptyLabel == true || (is_gpt && efi_partitions.is_empty)) {
            stdout.printf ("Creating EFI partition\n");
            var start = (uint64) 1;
            var efi_fs = new Ped.FileSystemType("");
            var efi_end = (uint64) ((start + (100 * 1024 * 1024))/ get_unit_size ());
            var ext = new Ped.Partition(disk, Ped.PartitionType.NORMAL, efi_fs, start, efi_end);
          
            if (EfiCollector.is_efi_system () && efi_partitions.is_empty) {
                ext.set_flag (Ped.PartitionFlag.ESP, 1);
            } else if (emptyLabel == true || (is_gpt && efi_partitions.is_empty)) {
                ext.set_flag (Ped.PartitionFlag.BIOS_GRUB, 1);
            }
            stdout.printf ("Primary partition %s%d\n", get_path(), ext.num);
            stdout.printf ("\nstart : " + start.to_string () + " end : " + efi_end.to_string () + "\n");
            disk.add_partition (ext, new Ped.Constraint.any (device));
            disk.commit_to_dev ();
            if (ext == null) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Can't create extended partition\n");
            }
            EfiCollector.reset ();
            start = efi_end + get_unit_size ();
            return start;
        } else {
            return 0;
        }
        
    }
    
    // \brief Delete existing partition
    public int delete_partition (int index) throws DeviceError {
        Ped.Partition p = disk.get_partition(index);

        if (p != null) {
            int retval = disk.delete_partition (p);
            commit_changes();
            return retval;
        } else {
            throw new DeviceError.CANT_CREATE_PARTITION ("Unable to delete existing partition\n");
        }
    }
   

 
    // \brief Create a partition
    // create a partition, either it is a primary, extended, or logical

    public int create_partition (uint64 byte_start, uint64 byte_end, string fs, string type, string mount) throws DeviceError {
            
        // TODO: validate
        Ped.Partition new_partition = null;
        Ped.FileSystemType new_fs = new Ped.FileSystemType(fs);
        uint64 start = (uint64) (byte_start / get_unit_size ());
        uint64 end  = (uint64) (byte_end / get_unit_size ());
        if (type == "normal") {
          new_partition = new Ped.Partition(disk, Ped.PartitionType.NORMAL, new_fs, start, end);
        } else if (type == "extended") {
          new_partition = new Ped.Partition(disk, Ped.PartitionType.EXTENDED, new_fs, start, end);
        } else if (type == "logical") {
          new_partition = new Ped.Partition(disk, Ped.PartitionType.LOGICAL, new_fs, start, end);
        }
        if (new_partition != null) {

            // collect part_num before commit
            int [] p_num_array = {};
            Ped.Partition? p = disk.part_list;
            while ((p = disk.next_partition (p)) != null) {
                p_num_array += p.num;
                stdout.printf ("origin : " + p.num.to_string () + "\n");
            }

            var part_num = disk.add_partition (new_partition, new Ped.Constraint.any (device));
            if (part_num == 0) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Unable to create partition\n");
            }
            commit_changes();
            
            // collect new part_num array after commit
            int [] p_num_array_new = {};
            Ped.Partition? q = disk.part_list;
            while ((q = disk.next_partition (q)) != null) {
                p_num_array_new += q.num;
                stdout.printf ("next : " + q.num.to_string () + "\n");
            }

            //find the new part_num
            foreach (int x in p_num_array_new) {
                bool is_exists = false;
                for (int i = 0;i < p_num_array.length;i++) {
                    if (x == p_num_array[i]) {
                        is_exists = true;
                    }
                }
                if (is_exists == false) {
                    part_num = x;
                }
            }

            // should return correct part number
            return part_num;

        } else {
            throw new DeviceError.CANT_CREATE_PARTITION ("Unable to create custom partition\n");
        }
    }  

    // \brief Create a partition (simple)
    //
    // Partition is created either inside a new extended partition
    // or as a new logical partition. The partition list will be
    // rebuilt. This function is used when user use simple partitioning interface.
    public int create_partition_simple (uint64 byte_start, uint64 byte_end, string fs, uint64 swap_size) throws DeviceError {
        if (device == null) {
            throw new DeviceError.CANT_CREATE_PARTITION ("Invalid device"); 
        }
        
        disk = new Ped.Disk.from_device (device);

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
            if (p.ptype == PartitionType.EXTENDED) {
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
                if (!(p.ptype == PartitionType.EXTENDED ||
                      p.ptype == PartitionType.FREESPACE)) {
                    throw new DeviceError.CANT_CREATE_PARTITION ("Partition to be created is inside another partition which is not an EXTENDED nor a FREE partition. %d\n", (int) p.ptype);
                }

                if (p.ptype == PartitionType.FREESPACE) {
                    if (has_extended == false) {
                        create_extended = true;
                    }
                    create_logical  = true;
                } else if (p.ptype == PartitionType.EXTENDED) {
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
            disk = new Ped.Disk (device, new Ped.DiskType("gpt"));
            stdout.printf ("Label created\n");
            if (disk != null) {
                disk.commit_to_dev ();
            }
        }


        Ped.Partition new_partition = null;
        Ped.FileSystemType fs_type = new Ped.FileSystemType(fs);
        uint64 start = (uint64) (byte_start / get_unit_size ());
        uint64 end  = (uint64) (byte_end / get_unit_size ());
        
        bool is_gpt = (disk.type.name == "gpt");

        // if this is an uefi system and there is  no partition
        ArrayList<string> efi_partitions = EfiCollector.get_partitions ();
        if ((EfiCollector.is_efi_system () && efi_partitions.is_empty) || emptyLabel == true || (is_gpt && efi_partitions.is_empty)) {
            stdout.printf ("Creating EFI partition\n");
            var efi_fs = new Ped.FileSystemType("");
            var efi_end = (uint64) ((start + (100 * 1024 * 1024))/ get_unit_size ());
            var ext = new Ped.Partition(disk, Ped.PartitionType.NORMAL, efi_fs, start, efi_end);
          
            if (EfiCollector.is_efi_system () && efi_partitions.is_empty) {
                ext.set_flag (Ped.PartitionFlag.ESP, 1);
            } else if (emptyLabel == true || (is_gpt && efi_partitions.is_empty)) {
                ext.set_flag (Ped.PartitionFlag.BIOS_GRUB, 1);
            }
            stdout.printf ("Primary partition %s%d\n", get_path(), ext.num);
            stdout.printf ("\nstart : " + start.to_string () + " end : " + efi_end.to_string () + "\n");
            disk.add_partition (ext, new Ped.Constraint.any (device));
            disk.commit_to_dev ();
            if (ext == null) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Can't create extended partition\n");
            }
            EfiCollector.reset ();
            start = efi_end + get_unit_size (); 
        }

        if (create_extended && !is_gpt) {
            stdout.printf ("Creating extended partition\n");
            var ext_fs = new Ped.FileSystemType("ext3");
            var ext = new Ped.Partition(disk, Ped.PartitionType.EXTENDED, ext_fs, start, end);
            stdout.printf ("Extended partition %s%d\n", get_path(), ext.num);
            stdout.printf ("\nstart : " + start.to_string () + " end : " + end.to_string () + "\n");
            disk.add_partition (ext, new Ped.Constraint.any (device));
            disk.commit_to_dev ();
            if (ext == null) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Can't create extended partition\n");
            }
        }

        var first_partition_type = Ped.PartitionType.LOGICAL;

        if (is_gpt) {
            first_partition_type = Ped.PartitionType.NORMAL;
            create_extended = false;
        }

        if (create_extended && !is_gpt) {
            stdout.printf ("Creating extended partition\n");
            var ext_fs = new Ped.FileSystemType("ext3");
            var ext = new Ped.Partition(disk, Ped.PartitionType.EXTENDED, ext_fs, start, end);
            stdout.printf ("Extended partition %s%d\n", get_path(), ext.num);
            stdout.printf ("\nstart : " + start.to_string () + " end : " + end.to_string () + "\n");
            disk.add_partition (ext, new Ped.Constraint.any (device));
            disk.commit_to_dev ();
            if (ext == null) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Can't create extended partition\n");
            }
        }

        if (swap_size > 0) {
            var swap_size_sector = (uint64) (swap_size / get_unit_size ());
            end  = start + swap_size_sector; 
            Ped.FileSystemType swap_type = new Ped.FileSystemType("linux-swap(v1)");
            if (is_gpt) {
                new_partition = new Ped.Partition(disk, Ped.PartitionType.NORMAL, swap_type, start, end);
            } else {
                new_partition = new Ped.Partition(disk, Ped.PartitionType.LOGICAL, swap_type, start, end);
            }
            start = end + 1; 
            end  = (uint64) (byte_end / get_unit_size ());
            var part_num = disk.add_partition (new_partition, new Ped.Constraint.any (device));
            if (part_num == 0) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Unable to create swap\n");
            }
        }



        new_partition = new Ped.Partition(disk, first_partition_type, fs_type, start, end);
        if (new_partition != null) {
            var part_num = disk.add_partition (new_partition, new Ped.Constraint.any (device));
            if (part_num == 0) {
                throw new DeviceError.CANT_CREATE_PARTITION ("Unable to create partition\n");
            }

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
        return ctx.evaluate_script (s, null, null, 0, null);
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
