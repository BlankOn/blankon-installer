void add_partition () {

    // nbd0 is created from the transaction-setup.sh script
    // nbdb0 should now is a totally empty and unitialized disk
    // It will produce harmless "unrecognised disk label" message on the screen 
    Test.add_func("/init", () => {
            // an empty disk would be created with gpt label 
            Device d = new Device.from_name("/dev/nbd0");
            assert(d.get_num_partitions() == -1);
            // save
            d.commit_changes();

            // reopen again
            d = new Device.from_name("/dev/nbd0");
            assert(d.get_num_partitions() == -1);
    });
}

void main (string[] args) {
    string stdout, stderr;
    int status;

    Process.spawn_sync("./", { "transaction-setup.sh" }, Environ.get(), 0, null, out stdout, out stderr, out status);
    Test.init (ref args);
    add_partition ();
    Test.run ();
    Process.spawn_sync("./", { "transaction-teardown.sh" }, Environ.get(), 0, null, out stdout, out stderr, out status);
}
