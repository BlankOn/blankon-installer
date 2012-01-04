using Gtk;
using GLib;
using WebKit;

public class Log : Object {
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


public class Installation : Object {
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
        COPY,
        SETUP,
        GRUB,
        DONE 
    }

    public string user_name { get; set construct; }
    public string host_name { get; set construct; }
    public string full_name { get; set construct; }
    public string computer_name { get; set construct; }
    public string partition { get; set construct; }
    public string grub_device { get; set construct; }
    public string language { get; set construct; }
    public string region { get; set construct; }
    public string keyboard { get; set construct; }
    public int state { get; set construct; }
    public string description { get; set construct; }

    Step step = Step.IDLE;
    Step last_step = Step.IDLE;

    signal void installation_started();

    IOChannel io_err;
    IOChannel io_out;

    public Installation.from_string(string uri) {
        state = State.NOT_STARTED;
        description = "";
        foreach (var param in uri.split("&")) {
            var entry = param.split("=");
            if (entry.length == 2) { // handle only valid key-value entry
                switch (entry [0]) {
                case "username":
                    user_name = entry[1];
                    break;
                case  "hostname":
                    host_name = entry[1];
                    break;
                case  "fullname":
                    full_name = entry[1];
                    break;
                case  "computername":
                    computer_name = entry[1];
                    break;
                case  "partition":
                    partition = entry[1];
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
                }
            }
        }

        installation_started.connect(() => {
            real_start();
        });
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
            Log.instance().log ("PARTITION");
            do_partition ();
            break;
        case Step.PARTITION:
            Log.instance().log ("FS");
            do_fs ();
            break;
        case Step.FS:
            Log.instance().log ("MOUNT");
            do_mount ();
            break;
        case Step.MOUNT:
            Log.instance().log ("COPY");
            do_copy ();
            break;
        case Step.COPY:
            Log.instance().log ("SETUP");
            do_setup ();
            break;
        case Step.SETUP:
            Log.instance().log ("GRUB");
            do_grub ();
            break;
        case Step.GRUB:
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
    
    void do_partition() {
        if (partition.contains ("free")) {
            string [] c = { "partition", partition };
            do_simple_command_with_args (c, Step.PARTITION, "Partitioning", "Unable to partition device");
        } else {
            last_step = Step.PARTITION;
            do_next_job ();
        }
    }

    void do_fs() {
        string [] c = { "/sbin/mkfs.ext4", partition };
        do_simple_command_with_args (c, Step.FS, "Installing filesystem", "Unable to install filesystem");
    }

    void do_mount () {
        DirUtils.create ("/target", 0700);
        string [] c = { "/bin/mount", partition, "/target" };
        do_simple_command_with_args (c, Step.MOUNT, "Mounting filesystem ", "Unable to mount filesystem");
    }

    void do_simple_command (string command_to_run, Step command_step, string command_description, string error_description) {
        string [] c = { command_to_run };
        do_simple_command_with_args (c, command_step, command_description, error_description);
    }
    
    void do_copy() {
        do_simple_command ("/sbin/b-i-copy-fs", Step.COPY, "Copying filesystem", "Unable to copy filesystem");
    }

    void do_setup () {
        do_simple_command ("/sbin/b-i-setup-fs", Step.SETUP, "Setting up", "Unable to setup installation");
    }

    void do_grub () {
        string [] c = { "/sbin/b-i-install-grub", grub_device };
        do_simple_command_with_args (c, Step.GRUB, "Installing GRUB", "Unable to install GRUB");
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
}

public class Utils {
    public static void write_simple_file (string uri, string content) {
        try {
            var file = File.new_for_uri (uri);
            if (file.query_exists ()) {
                file.delete ();
            }
            var dos = new DataOutputStream (file.create (FileCreateFlags.REPLACE_DESTINATION));
            dos.put_string (content);
            dos.close ();
        } catch (Error e) {
            stderr.printf ("%s\n", e.message);
        }
    }


}

public class Installer : WebView {
    Installation installation = null;

    string translate_uri (string old) {
        var uri = old.replace("http://system", "file://" + Config.SYSTEM_PATH + "/");
        return uri;
    }

    string translate_parted (string old) {
        var result = Parted.process_request (old);
        var uri = old.replace("http://parted/", "file:///tmp/parted_");
        Utils.write_simple_file (uri, result);
        return uri;
    }

    string translate_install(string uri) {
        var path = uri.replace("http://install/", "");
        if (path.has_prefix("show_log?")) {
            uri = "file:///var/log/blankon-installer.log";
            return uri;
        } else if (path.has_prefix("start?")) {
            installation = new Installation.from_string(path.replace("start?", ""));
            installation.start ();
        } else if (path.has_prefix("status?")) {
            // Kludge!
            var location = "file:///tmp/install_status";
            var result = "{ 'status': %d, 'description': '%s' }";
            Utils.write_simple_file (location, result.printf(installation.state, installation.description));
            return location;
        }
        return "about:blank";
    }

    public Installer () {
        var settings = new WebSettings();
        settings.enable_file_access_from_file_uris = true;
        settings.enable_universal_access_from_file_uris = true;
        set_settings(settings);

        resource_request_starting.connect((frame, resource, request, response) => {
            if (request.uri.has_prefix("http://install/")) {
                var uri = translate_install (resource.uri);
                request.set_uri(uri);
            } else if (request.uri.has_prefix("http://parted")) {
                var uri = translate_parted (resource.uri);
                request.set_uri(uri);
            } else if (request.uri.has_prefix("http://shutdown")) {
                Gtk.main_quit();
            } else {
                var uri = translate_uri (resource.uri);
                request.set_uri(uri);
            }
        });

    }

    public void start() {
        load_uri ("http://system/index.html");
    }
}
