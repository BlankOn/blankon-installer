using Gtk;
using GLib;
using WebKit;

public class Installer : WebView {

    string translate_uri (string old) {
        var uri = old.replace("http://system", "file://" + Config.SYSTEM_PATH + "/");
        return uri;
    }

    string translate_parted (string old) {
        var result = Parted.process_request (old);
        // Kludge!
        var uri = old.replace("http://parted/", "file:///tmp/parted_");
        try {
            var file = File.new_for_uri (uri);
            if (file.query_exists ()) {
                file.delete ();
            }
            var dos = new DataOutputStream (file.create (FileCreateFlags.REPLACE_DESTINATION));
            dos.put_string (result);
        } catch (Error e) {
            stderr.printf ("%s\n", e.message);
        }
        return uri;
    }

    public Installer () {
        var settings = new WebSettings();
        settings.enable_file_access_from_file_uris = true;
        settings.enable_universal_access_from_file_uris = true;
        set_settings(settings);

        resource_request_starting.connect((frame, resource, request, response) => {
            if (request.uri.has_prefix("http://parted")) {
                var uri = translate_parted (resource.uri);
                stdout.printf("R:|%s|\n", uri) ;
                request.set_uri(uri);
            } else {
                var uri = translate_uri (resource.uri);
                stdout.printf("|%s|\n", uri);
                request.set_uri(uri);
            }
        });

        load_uri ("http://system/index.html");
    }
}
