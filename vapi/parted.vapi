[CCode (cheader_filename = "parted/parted.h")]
namespace Ped {
    [CCode (unref_function = "ped_constraint_destroy")]
        public class Constraint {
            [CCode (cname = "ped_constraint_any")]
                public Constraint.any(Device device);
        }

    [CCode (ref_function = "", unref_function = "")]
        public class Device {
            public string model;
            public string path;
            [CCode (cname = "sector_size")]
            public uint64 sector_size_logical;
            [CCode (cname = "phys_sector_size")]
            public uint64 sector_size_physical;
            public Sector length;

            [CCode (cname = "ped_device_get")]
            public Device.from_name (string name);
            [CCode (cname = "ped_device_get_next")]
            public Device.from_list (Device start);
            public static void probe_all ();
            public static void free_all ();
            public void open ();
            public void close ();

        }

    [CCode (unref_function = "ped_disk_destroy")]
        public class Disk {
            [CCode (cname = "ped_disk_new_fresh")]
            public Disk(Device device, DiskType disk_type);

            [CCode (cname = "ped_disk_new")]
            public Disk.from_device(Ped.Device device);

            public int get_last_partition_num();
            public int delete_all();
            public int add_partition(Partition part, Constraint constraint);
            public int commit_to_dev();
            public int commit_to_os();
            public DiskType type;
            public Partition get_partition(int num);

            public Partition? part_list;
            public Partition? next_partition (Partition prior);
        }

    [CCode (unref_function = "")]
        public class DiskType {
            [CCode (cname = "ped_disk_type_get")]
                public DiskType(string name);

            public string name;
        }

    [SimpleType]
        [IntegerType]
        public struct Sector {
        }

    [CCode (ref_function = "", unref_function = "")]
        public class Partition {

            [CCode (cname = "ped_partition_new")]
                public Partition(Disk disk,
                        PartitionType type,
                        FileSystemType fs_type,
                        Sector start,
                        Sector end);

            public weak Ped.Geometry geom;
            public int num;
            public FileSystemType fs_type;
            public PartitionType type;
            public string get_name ();
        }

    [CCode (cprefix = "PED_PARTITION_", cname = "_PedPartitionType")]
        public enum PartitionType {
            NORMAL,
                LOGICAL,
                EXTENDED,
                FREESPACE,
                METADATA,
                PROTECTED;
        }

    [CCode (cprefix = "PED_UNIT_", cname = "PedUnit")]
        public enum Unit {
            SECTOR,
            BYTE,
            KILOBYTE,
            MEGABYTE,
            GIGABYTE,
            TERABYTE,
            COMPACT,
            CYLINDER,
            CHS,
            PERCENT,
            KIBIBYTE,
            MEBIBYTE,
            GIBIBYTE,
            TEBIBYTE
    }

    [CCode (unref_function = "")]
        public class FileSystem {
            [CCode (cname = "ped_file_system_create")]
                public FileSystem.create(Geometry **geom,
                        FileSystemType type,
                        Timer? timer);
            public FileSystemType? type;
        }

    [CCode (unref_function = "")]
        public class FileSystemType {
            [CCode (cname="ped_file_system_type_get")]
                public FileSystemType(string name);
            public string name;
        }

    [CCode (ref_function = "", unref_function = "")]
    public struct Geometry {
        public Sector start;
        public Sector end;
        public Sector length;
    }

    public class Timer {
    }

    public class Utils {
        [CCode (cname="ped_unit_set_default")]
        public static void set_default_unit (Unit unit);
    }
}
