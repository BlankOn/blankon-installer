void modify_partition () {

    // nbd0 is created from the transaction-setup.sh script
    // nbdb0 should now is a totally empty and unitialized disk
    // It will produce harmless "unrecognised disk label" message on the screen 
    Test.add_func("/modify/init", () => {
            // an empty disk would be created with gpt label 
            Device d = new Device.from_name("/dev/nbd0");
            assert(d.get_num_partitions() == 0);
            // save
            d.commit_changes();

            // reopen again
            d = new Device.from_name("/dev/nbd0");
            assert(d.get_num_partitions() == 0);
    });

    Test.add_func("/modify/add", () => {
        Device d = new Device.from_name("/dev/nbd0");

        int part_num = d.create_partition(512, 100000, "ext4", "normal", "/"); 
        assert(d.get_num_partitions() == 1);
        assert(part_num == 1);
        part_num = d.create_partition(1000000, 2000000, "ext4", "normal", "/1"); 
        assert(d.get_num_partitions() == 2);
        part_num = d.create_partition(2000000, 3000000, "ext4", "normal", "/1"); 
        assert(d.get_num_partitions() == 3);
    });

    Test.add_func("/modify/remove", () => {
        Device d = new Device.from_name("/dev/nbd0");
        int retval = d.delete_partition(1); 
        assert(retval == 1);
        assert(d.get_num_partitions() == 2);
        retval = d.delete_partition(2); 
        assert(retval == 1);
        assert(d.get_num_partitions() == 1);
        retval = d.delete_partition(3); 
        assert(retval == 1);
        assert(d.get_num_partitions() == 0);
    });
}

void main (string[] args) {
    string stdout, stderr;
    int status;

    Process.spawn_sync("./", { "transaction-setup.sh" }, Environ.get(), 0, null, out stdout, out stderr, out status);
    Test.init (ref args);
    modify_partition ();
    Test.run ();
    Process.spawn_sync("./", { "transaction-teardown.sh" }, Environ.get(), 0, null, out stdout, out stderr, out status);
}
