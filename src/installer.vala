using Gtk;
using GLib;
using WebKit;

public class Installer : WebView {


    string translate_uri (string old) {
        var uri = old.replace("http://system", "file://" + Config.SYSTEM_PATH + "/");
        return uri;
    }

    public Installer () {
        var settings = new WebSettings();
        settings.enable_file_access_from_file_uris = true;
        set_settings(settings);

        resource_request_starting.connect((frame, resource, request) => {
            stdout.printf("->%s\n", request.uri);
            var scheme = Uri.parse_scheme (resource.uri);
            if (scheme == "http") {
                var uri = translate_uri (resource.uri);
                stdout.printf("->%s\n", uri);
                request.set_uri(uri);
            }
        });

        load_uri ("http://system/index.html");
    }
}
