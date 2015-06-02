using Gtk;
using Gee;
using GLib;
using WebKit;
using JSCore;

public class Log : GLib.Object {
    DataOutputStream stream;
    static Log _instance = null;

    public Log () {
        try {
            var file = File.new_for_path ("/var/log/blankon-installer.log");
            if (file.query_exists ()) {
                file.delete ();
            }
            stream = new DataOutputStream (file.create (FileCreateFlags.REPLACE_DESTINATION));
        } catch (Error e) {
            stderr.printf ("%s\n", e.message);
        }
    }

    public void log_without_newline (string string) {
        stream.put_string (string);
    }

    public void log (string string) {
        stream.put_string (string);
        stream.put_string ("\n");
    }

    public static Log instance() {
        if (_instance == null) {
            _instance = new Log ();
        }

        return _instance;
    }
}


public class Installation : GLib.Object {
    const uint64 OneGig = 1024*1024*1024;
    public enum State {
        NOT_STARTED,
        ON_GOING,
        ERROR,
        DONE
    }

    enum Step {
        IDLE,
        PARTITION,
        FS,
        MOUNT,
        MOUNTHOME,
        COPY,
        SETUP,
        GRUB,
        CLEANUP,
        DONE 
    }

    public int partition { get; set construct; }
    public int device { get; set construct; }
    public string user_name { get; set construct; }
    public string password { get; set construct; }
    public string host_name { get; set construct; }
    public string full_name { get; set construct; }
    public string grub_device { get; set construct; }
    public string language { get; set construct; }
    public string region { get; set construct; }
    public string keyboard { get; set construct; }
    public string home { get; set construct; }
    public string root { get; set construct; }
    public bool autologin { get; set construct; }
    public bool advancedMode { get; set construct; }
    public int state { get; set construct; }
    public int progress { get; private set; }
    public string description { get; set construct; }
    public string steps { get; set construct; }

    public bool separatedHome = false;

    uint64 installation_size;
    string partition_path;
    string device_path;

    Step step = Step.IDLE;
    Step last_step = Step.IDLE;

    signal void installation_started();

    IOChannel io_err;
    IOChannel io_out;

    public Installation.from_string(string uri) {
        progress = 0;
        state = State.NOT_STARTED;
        description = "";
        autologin = false;
        foreach (var param in uri.split("&")) {
            var entry = param.split("=");
            if (entry.length == 2) { // handle only valid key-value entry
                switch (entry [0]) {
                case "device":
                    device = int.parse (entry[1]);
                    Log.instance().log ("Selected Drive : " + device.to_string ());
                    break;
                case "device_path":
                    device_path = entry[1];
                    break;
                case "partition":
                    partition = int.parse (entry[1]);
                    break;
                case "username":
                    user_name = entry[1];
                    break;
                case "password":
                    password = entry[1];
                    break;
                case  "hostname":
                    host_name = entry[1];
                    break;
                case  "fullname":
                    full_name = entry[1];
                    break;
                case  "grubdevice":
                    grub_device = entry[1];
                    break;
                case  "language":
                    language = entry[1];
                    break;
                case  "region":
                    region = entry[1];
                    break;
                case  "keyboard":
                    keyboard = entry[1];
                    break;
                case  "autologin":
                    autologin = (entry[1] == "true");
                    break;
                case  "home":
                    home = entry[1];
                    break;
                case  "advancedMode":
                    advancedMode = (entry[1] == "true");
                    break;
                case  "steps":
                    steps = entry[1];
                    break;
                }
            }
        }

        installation_started.connect(() => {
            real_start();
        });

        installation_size = 4 * OneGig;
        try {
            var file = File.new_for_path ("/live/image/.disk/installation_size");
            if (file.query_exists ()) {
                var dis = new DataInputStream (file.read());
                size_t l;
                var line = dis.read_line (out l);
                dis.close ();
                if (line != null) {
                    installation_size = uint64.parse (line);
                    if (installation_size <= 0) {
                        installation_size = 4 * OneGig;
                    }
                }
            }
        } catch (Error e) {
            stderr.printf ("%s\n", e.message);
        }

    }

    public void start() {
        installation_started ();
    }

    void real_start() {
        Log.instance().log ("START");
        state = State.ON_GOING;
        do_next_job ();
    }

    void do_next_job () {
        switch (last_step) {
        case Step.IDLE:
            progress = 5;
            Log.instance().log ("PARTITION");
            do_partition ();
            break;
        case Step.PARTITION:
            progress = 10;
            Log.instance().log ("FS");
            do_fs ();
            break;
        case Step.FS:
            Log.instance().log ("MOUNT");
            do_mount ();
            break;
        case Step.MOUNT:
            Log.instance().log ("MOUNTHOME");
            do_mount_home ();
            break;
        case Step.MOUNTHOME:
            progress = 15;
            Log.instance().log ("COPY");
            do_copy ();
            break;
        case Step.COPY:
            progress = 80;
            Log.instance().log ("SETUP");
            do_setup ();
            break;
        case Step.SETUP:
            progress = 90;
            Log.instance().log ("GRUB");
            do_grub ();
            break;
        case Step.GRUB:
            Log.instance().log ("CLEANUP");
            do_cleanup ();
            break;
        case Step.CLEANUP:
            progress = 100;
            Log.instance().log ("DONE");
            do_done ();
            break;
        case Step.DONE:
            if (state != State.ERROR) {
                Log.instance().log ("ERROR");
                description = "Done";
            } else {
                Log.instance().log ("DONE");
            }

            break;
        }
    }

    void child_watch (Pid pid, int status) {
        if (Process.if_exited (status) && Process.exit_status (status) == 0) {
            if (Process.exit_status (status) == 0) {
                Log.instance().log("Child " + ((int) pid).to_string () + " has finished it's task successfuly.");
                last_step = step;
                step = Step.IDLE;
            } else {
                Log.instance().log("Child " + ((int) pid).to_string () + " has ended and return with " + Process.exit_status (status).to_string());
                state = State.ERROR;
                step = Step.DONE;
                last_step = Step.DONE;
            }
        } else {
            Log.instance().log("Child " + ((int) pid).to_string () + " has ended and failed.");
            state = State.ERROR;
            step = Step.DONE;
            last_step = Step.DONE;
        }
        do_next_job ();
    }


    void do_simple_command_with_args (string[] commands_to_run, Step command_step, string command_description, string error_description) {
        var pid = 0;
        pid = run (commands_to_run);
        if (pid != 0) {
            step = command_step;
            description = command_description;
        } else {
            step = Step.DONE;
            last_step = Step.DONE;
            state = State.ERROR;
            description = error_description;
        }
    }
    
    void do_partition() {;
        
        if (advancedMode == true) {
                  
            
            description = "Partitioning";
            step = Step.PARTITION;
            
            Device dev_init = new Device.from_name(device_path);
            var start_after_esp_bios_grub = dev_init.initialize_esp_bios_grub();
 
            var can_continue = false;
            Log.instance().log ("Enter advanced partitioning ");
            Log.instance().log (steps);
            // split steps parameter to an array
            // this stepsArray is contain step that should be done in partitioning
            // if a step has root mountPoint option, it should return the partition id to partition_path variable;
            var stepsArray = steps.split(",");

            foreach (var s in stepsArray) {
              /* int num_partitions = dev.get_num_partitions(); */
              /* Log.instance().log (num_partitions.to_string ()); */
              // split params
              var splittedParams = s.split(";");
              Log.instance().log (splittedParams[0]);
              
              switch (splittedParams[0]) {
              case  "create":
                  // reopen again
                  Device dev = new Device.from_name(device_path);
                  var range = splittedParams[3].split("-");
                  if (start_after_esp_bios_grub > 0) {
                    range[0] = start_after_esp_bios_grub.to_string ();
                    start_after_esp_bios_grub = 0;
                  }
                  Log.instance().log ("range_start :" + range[0]);
                  Log.instance().log ("range_start :" + range[1]);
                  var mount = "none";
                  if (splittedParams[4] == "root" || splittedParams[4] == "home") {
                      mount = splittedParams[4]; 
                  }
                  int new_partition = dev.create_partition (uint64.parse (range[0]), uint64.parse (range[1]), splittedParams[2], splittedParams[1], mount);
                  
                  Log.instance().log ("=================" + new_partition.to_string ());
        
                  if (splittedParams[4] == "root") {
                      Log.instance().log ("root");
                      root = new_partition.to_string ();
                  } else if (splittedParams[4] == "home") {
                      Log.instance().log ("home");
                      home = new_partition.to_string ();
                      separatedHome = true;
                      Process.spawn_command_line_sync ("/sbin/mkfs." + splittedParams[2] + " -F " + device_path + new_partition.to_string ());
                  } else {
                      Log.instance().log ("neither root or home");
                      if (splittedParams[2] == "linux-swap") {
                          Process.spawn_command_line_sync ("/sbin/mkswap " + device_path + new_partition.to_string ());
                      } else {
                          Process.spawn_command_line_sync ("/sbin/mkfs." + splittedParams[2] + " -F " + device_path + new_partition.to_string ());
                      }
                  }
                  Log.instance().log ("newly created " + new_partition.to_string ());
                  break;
              case  "format":
                  var id = splittedParams[1];
                  if (splittedParams[2] == "linux-swap") {
                      Process.spawn_command_line_sync ("/sbin/mkswap " + device_path + splittedParams[1]);
                  } else {
                      Process.spawn_command_line_sync ("/sbin/mkfs." + splittedParams[2] + " -F " + device_path + splittedParams[1]);
                  }
                  Log.instance().log ("should format partition " + splittedParams[1]);
                  if (splittedParams[3] == "root") {
                      Log.instance().log ("root");
                      root = splittedParams[1];
                  } else if (splittedParams[3] == "home") {
                      home = splittedParams[1];
                      separatedHome = true;
                  }
                  break;
              case  "delete":
                  // reopen again
                  Device dev = new Device.from_name(device_path);
                  var id = splittedParams[1];
                  Log.instance().log ("should delete partition " + splittedParams[1]);
                  var result = dev.delete_partition (int.parse (splittedParams[1]));
                Log.instance().log ("\nDeleted :" + result.to_string ()  + "\n");
      
                  break;
              case  "home":
                  home = splittedParams[1];
                  separatedHome = true;
                  break;
              }
            }
            partition_path = device_path + root;
            Log.instance().log ("\nTarget :" + partition_path + "\n");
            if (separatedHome == true) {
                home = device_path + home;
                Log.instance().log ("\nHome :" + home + "\n");
            }
            last_step = Step.PARTITION;
            do_next_job ();
        
        } else {
            var d = Parted.get_devices (true); 
    
            var inconsistent = false;
    
            if (d != null && device > d.size) {
                inconsistent = true;
            } else {
                if (d.get (device).partitions != null 
                    && partition > d.get (device).partitions.size) {
                    inconsistent = true;
                }
            }
    
            if (inconsistent) {
                step = Step.DONE;
                last_step = Step.DONE;
                state = State.ERROR;
                description = "Inconsistent partition record";
                return;
            }
            
            var partitions = d.get (device).partitions;
            device_path = d.get (device).get_path ();
            description = "Partitioning";
            step = Step.PARTITION; 
    
            Log.instance().log ("Enter simple partitioning");
            if (partitions.get (partition).ptype == Device.PartitionType.FREESPACE) {
                Device device = new Device.from_name (device_path);
                var can_continue = false;
                var new_partition = -1;
                try {
                    uint64 swap_size = 0;
                    if (SwapCollector.get_partitions().is_empty) {
                         if (partitions.get(partition).size - OneGig > installation_size) {
                            swap_size = OneGig;
                            Log.instance().log ("No swap detected, creating swap along with partition creation, swap size = " + swap_size.to_string());
                         }
                    }
                    swap_size = OneGig;
                    new_partition = device.create_partition_simple (partitions.get (partition).start,
                                                             partitions.get (partition).end,
                                                             "ext4", swap_size);
    
                    Log.instance().log ("Partition creation returns new partition ID: " + new_partition.to_string ());
                    if (new_partition != -1) {
                        can_continue = true;
                    }
                } catch (DeviceError e) {
                    Log.instance().log_without_newline (e.message);
                }
              
    
                if (can_continue == false) {
                    step = Step.DONE;
                    last_step = Step.DONE;
                    state = State.ERROR;
                    description = "Error while doing partition";
                    return;
                } 
                Parted.get_devices (false); // re-read devices and partitions
                partition_path = device_path + new_partition.to_string ();
            } else {
                partition_path = d.get (device).get_path () + partitions.get (partition).number.to_string ();
            }
            last_step = Step.PARTITION;
            do_next_job ();
        }
    }

    void do_fs() {
        string [] c = { "/sbin/mkfs.ext4", partition_path };
        do_simple_command_with_args (c, Step.FS, "Installing filesystem", "Unable to install filesystem");
    }
    


    void do_mount () {
        Log.instance().log ("\nho home\n");
        DirUtils.create ("/target", 0700);
        string [] c = { "/bin/mount", partition_path, "/target" };
        do_simple_command_with_args (c, Step.MOUNT, "Mounting filesystem ", "Unable to mount filesystem");
    }
    
    void do_mount_home () {
        if (separatedHome == true && advancedMode == true) {
            // should write fstab configuration to somewhere
            // then it will be copied in b-i-cleanup, just before umount
            Log.instance().log ("\nmount separated home partition\n");
            DirUtils.create ("/target/home", 0700);
            string [] c = { "/bin/mount", home, "/target/home" };
            do_simple_command_with_args (c, Step.MOUNTHOME, "Mounting home filesystem ", "Unable to mount home filesystem");
        
            // write fstab file at tmp, will be copied to /target/etc/fstab by b-i-setup-fs script
            var content = partition_path + " / ext4 defaults 1 2";
            Utils.write_simple_file ("/tmp/fstab", content);
            content = home + " /home ext4 defaults 1 2";
            Utils.write_simple_file ("/tmp/fstab", content);

        } else {
            last_step = Step.MOUNTHOME;
            do_next_job ();
        }
    }

    void do_simple_command (string command_to_run, Step command_step, string command_description, string error_description) {
        string [] c = { command_to_run };
        do_simple_command_with_args (c, command_step, command_description, error_description);
    }
    
    void do_copy() {
        do_simple_command ("/sbin/b-i-copy-fs", Step.COPY, "Copying filesystem", "Unable to copy filesystem");
    }

    void do_setup () {
        var content = ("%s:%s\n").printf(user_name, password);
        Utils.write_simple_file ("/tmp/user-pass", content);

        content = ("%d %s\n").printf((int) autologin, user_name);
        Utils.write_simple_file ("/tmp/user-setup", content);

        content = ("%s\n\n\n\n\n").printf(full_name);
        Utils.write_simple_file ("/tmp/user-info", content);

        content = ("%s\n").printf(host_name);
        Utils.write_simple_file ("/tmp/hostname", content);

        SwapCollector.reset ();
        var swaps = "";
        foreach (var p in SwapCollector.get_partitions ()) {
            swaps += p + "\n";
        }

        content = ("%s").printf(swaps);
        Utils.write_simple_file ("/tmp/swaps", content);

        do_simple_command ("/sbin/b-i-setup-fs", Step.SETUP, "Setting up", "Unable to setup installation");
    }

    void do_grub () {
        var device = device_path; // TODO
        if (device == "") {
            device = device_path;
        }

        string efi_partition = "";
        string need_format = "";
        ArrayList<string> efi_partitions = EfiCollector.get_partitions ();
        if (EfiCollector.is_efi_system () && !efi_partitions.is_empty) {
            efi_partition = efi_partitions.get (0);
            if (EfiCollector.need_format (efi_partition)) {
                need_format = "Y";
            }
        }
        string [] c = { "/sbin/b-i-install-grub", device, efi_partition, need_format };
        do_simple_command_with_args (c, Step.GRUB, "Installing GRUB", "Unable to install GRUB");
    }

    void do_cleanup() {
        do_simple_command ("/sbin/b-i-cleanup", Step.CLEANUP, "Cleaning up", "Unable to properly clean up");
    }

    void do_done () {
        step = Step.DONE;
        last_step = Step.DONE;
        state = State.DONE;
        do_next_job ();
    }

    bool watch_stderr (IOChannel gio, IOCondition condition) {
        return watch_gio (gio, condition, "STDERR: ");
    }


    bool watch_stdout (IOChannel gio, IOCondition condition) {
        return watch_gio (gio, condition, "STDOUT: ");
    }

    bool watch_gio (IOChannel gio, IOCondition condition, string prefix) {
        IOStatus ret;
        string msg;
        size_t len;
        var result = true;

        if ((condition & IOCondition.HUP) == IOCondition.HUP) {
            result = false;
        }

        try {
            while (gio.read_line(out msg, out len, null) == IOStatus.NORMAL) {
                Log.instance().log_without_newline (prefix + msg);
            }
        }
        catch(IOChannelError e) {
            Log.instance().log (prefix + "Error reading: " + e.message);
        }
        catch(ConvertError e) {
            Log.instance().log (prefix + "Error reading: " + e.message);
        }


        return result;

    }

    int run (string[] command) {
        string[] env = { "LC_ALL=C" };

        var cmd_log = "Running command: '";
        foreach (var c in command) {
            cmd_log += c + " ";
        }
        cmd_log += "'";

        int fd_out, fd_err, child_pid;
        Log.instance().log (cmd_log);

        try {
            Process.spawn_async_with_pipes ("/tmp/", command, env, SpawnFlags.DO_NOT_REAP_CHILD, null, out child_pid, null, out fd_out, out fd_err); 
        } catch (GLib.Error e) {
            Log.instance().log ("Error running: " + e.message);
            return -1;
        }

        var w = ChildWatch.add (child_pid, child_watch);
        Log.instance().log ("Child is spawn with PID: " + child_pid.to_string() + " and watched as " + w.to_string()); 

        io_out = new IOChannel.unix_new(fd_out);
        io_err = new IOChannel.unix_new(fd_err);

        if(!(io_out.add_watch(IOCondition.IN | IOCondition.HUP, watch_stdout) != 0)) {
            Log.instance().log ("Error watching stdout for cmd_log");
            return -1;
        }

        if(!(io_err.add_watch(IOCondition.IN | IOCondition.HUP, watch_stderr) != 0)) {
            Log.instance().log ("Error watching stderr for cmd_log");
            return -1;
        }

        return child_pid;
    }

	public static JSCore.Object js_constructor (Context ctx,
        JSCore.Object constructor, 
        JSCore.Value[] arguments, 
        out JSCore.Value exception) {

        var c = new Class (js_class);
        var o = new JSCore.Object (ctx, c, null);
        var s = new String.with_utf8_c_string ("getStatus");
        var f = new JSCore.Object.function_with_callback (ctx, s, js_get_status);  
        o.set_property (ctx, s, f, 0, null);  

        s = new String.with_utf8_c_string ("start");
        f = new JSCore.Object.function_with_callback (ctx, s, js_start);  
        o.set_property (ctx, s, f, 0, null);  
        if (arguments.length == 1) {
            s = arguments [0].to_string_copy (ctx, null);
            char buffer[1024];
            s.get_utf8_c_string (buffer, buffer.length);
            Installation* i = new Installation.from_string((string)buffer);
            o.set_private (i);
        }
        return o;
    }

    public static JSCore.Value js_get_status (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        var i = thisObject.get_private() as Installation;
        if (i != null) {
            var result = "({ 'status': %d, 'description': '%s', 'progress': %d })".printf (i.state, i.description, i.progress);
            var s = new String.with_utf8_c_string (result);
            return ctx.evaluate_script (s, null, null, 0, null);
        }
        return new JSCore.Value.undefined (ctx);
    }

    public static JSCore.Value js_start (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        var i = thisObject.get_private() as Installation;
        if (i != null) {
            i.start ();
        }
        return new JSCore.Value.undefined (ctx);
    }


    public static JSCore.Value js_shutdown (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        Gtk.main_quit();

        return new JSCore.Value.undefined (ctx);
    }

    public static JSCore.Value js_reboot (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        var location = "/tmp/post-install.sh";
        Utils.write_simple_file (location, "sudo /sbin/reboot\n");
        Process.spawn_command_line_sync ("/bin/chmod a+x /tmp/post-install.sh");
        Gtk.main_quit();

        return new JSCore.Value.undefined (ctx);
    }

    public static JSCore.Value js_translate (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        exception = null;
        if (arguments.length == 1) {
            var s = arguments [0].to_string_copy (ctx, null);
            char[] buffer = new char[s.get_length() + 1];
            s.get_utf8_c_string (buffer, buffer.length);

            s = new String.with_utf8_c_string (_((string) buffer));
            var result = new JSCore.Value.string (ctx, s);
            s = null;
            buffer = null;
            return result;
        }

        return new JSCore.Value.undefined (ctx);
    }

    public static JSCore.Value js_set_timezone (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        exception = null;
        if (arguments.length == 1) {
            var s = arguments [0].to_string_copy (ctx, null);
            char[] buffer = new char[s.get_length() + 1];
            s.get_utf8_c_string (buffer, buffer.length);

            stdout.printf("Changing timezone to %s\n", (string) buffer);

            FileUtils.unlink("/etc/localtime");
            FileUtils.symlink("/usr/share/zoneinfo/%s".printf((string) buffer), "/etc/localtime");
            Utils.write_simple_file("/run/timezone", "TZ=%s\nexport TZ\n".printf((string)buffer));
            buffer = null;
        }

        return new JSCore.Value.undefined (ctx);
    }

    public static JSCore.Value js_set_locale (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        exception = null;
        if (arguments.length == 1) {
            var s = arguments [0].to_string_copy (ctx, null);
            char[] buffer = new char[s.get_length() + 1];
            s.get_utf8_c_string (buffer, buffer.length);

            var x = Intl.setlocale(LocaleCategory.ALL, (string)buffer);
            stdout.printf("Changing locale to %s: %s\n", (string) buffer, x);

            Intl.bindtextdomain( Config.GETTEXT_PACKAGE, Config.LOCALEDIR );
            Intl.bind_textdomain_codeset( Config.GETTEXT_PACKAGE, "UTF-8" );
            Intl.textdomain( Config.GETTEXT_PACKAGE );
            Utils.write_simple_file("/run/locale", "LC_ALL=%s\nLANG=%s\n".printf((string)buffer, (string)buffer));
            Process.spawn_command_line_sync ("/bin/cp /run/locale /etc/default/locale");
            buffer = null;
        }

        return new JSCore.Value.undefined (ctx);
    }

    public static JSCore.Value js_get_locale_list (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        exception = null;

        string normal_output;
        string error_output;
        int status;
        string[] args = { "/usr/bin/locale", "-a" };
        string[] env = { "LC_ALL=C" };

        try {
            Process.spawn_sync ("/tmp", args, env,  SpawnFlags.LEAVE_DESCRIPTORS_OPEN, null, out normal_output, out error_output, out status);
        } catch (GLib.Error e) {
        }

        var result = "["; 
        foreach (var line in normal_output.split("\n")) {
            if (line == "") continue;
            if (!(line == "C" || line.has_prefix ("C.") || line == "POSIX")) {
               result += "'" + line + "',"; 
            }
        } 
        result += "'C']";
        var s = new String.with_utf8_c_string (result);
        return ctx.evaluate_script (s, null, null, 0, null);
    }

    static const JSCore.StaticFunction[] js_funcs = {
        { "shutdown", js_shutdown, PropertyAttribute.ReadOnly },
        { "reboot", js_reboot, PropertyAttribute.ReadOnly },
        { "translate", js_translate, PropertyAttribute.ReadOnly },
        { "setLocale", js_set_locale, PropertyAttribute.ReadOnly },
        { "setTimezone", js_set_timezone, PropertyAttribute.ReadOnly },
        { "getLocaleList", js_get_locale_list, PropertyAttribute.ReadOnly },
        { null, null, 0 }
    };

    static const ClassDefinition js_class = {
        0,
        ClassAttribute.None,
        "Installation",
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
        js_constructor,
        null,
        null
    };

    public static void setup_js_class (GlobalContext context) {
        var c = new Class (js_class);
        var o = new JSCore.Object (context, c, context);
        var g = context.get_global_object ();
        var s = new String.with_utf8_c_string ("Installation");
        g.set_property (context, s, o, PropertyAttribute.None, null);
    }

}

public class Installer : WebView {
    string translate_uri (string old) {
        var uri = old.replace("http://system", "file://" + Config.SYSTEM_PATH + "/");
        return uri;
    }

    string translate_install(string uri) {
        var path = uri.replace("http://install/", "");
        if (path.has_prefix("show_log?")) {
            uri = "file:///var/log/blankon-installer.log";
            return uri;
        } 
        return "about:blank";
    }

    string translate_theme (string old) {
        var uri = "file://%s".printf(Utils.get_icon_path (old.replace("theme://", "")));
        return uri;
    }
    
    unowned string debug = GLib.Environment.get_variable("DEBUG");

    public Installer () {
        var settings = new WebSettings();
        if (debug == "1") {
          settings.enable_developer_extras = true;
          web_inspector.inspect_web_view.connect(getInspectorView);
        }
        settings.enable_file_access_from_file_uris = true;
        settings.enable_universal_access_from_file_uris = true;
        set_settings(settings);

        resource_request_starting.connect((frame, resource, request, response) => {
            if (resource.uri.has_prefix("theme://")) {
                request.set_uri(translate_theme(resource.uri));
            } else if (request.uri.has_prefix("http://install/")) {
                var uri = translate_install (resource.uri);
                request.set_uri(uri);
            } else {
                var uri = translate_uri (resource.uri);
                request.set_uri(uri);
            }
        });

        window_object_cleared.connect ((frame, context) => {
            Utils.setup_js_class ((JSCore.GlobalContext) context);
            Parted.setup_js_class ((JSCore.GlobalContext) context);
            Installation.setup_js_class ((JSCore.GlobalContext) context);
        });
    }
    
    private unowned WebView getInspectorView(WebView inspectedView) {
        Window window = new Window();
        WebView webview = new WebView();
        ScrolledWindow scrolled_window = new ScrolledWindow(null, null);
        scrolled_window.set_policy(PolicyType.AUTOMATIC, PolicyType.AUTOMATIC);
        scrolled_window.add(webview);
        window.add(scrolled_window);
        window.title = "Inspector";
        window.set_default_size(640, 480);
        window.show_all();
        window.delete_event.connect(() => {
            webview.web_inspector.close();
            return false;
        });
        unowned WebView handle = webview;
        return handle;
    }

    public void start() {
        load_uri ("http://system/index.html");
    }
}
