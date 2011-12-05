using Gtk;
using GLib;
using WebKit;

public class Installer : WebView {


    string translate_uri (string old) {
        var uri = old.replace("system://", "file://" + Config.SYSTEM_PATH + "/");
        return uri;
    }

    public Installer () {
        load_uri ("file:///tmp/o.html");

        resource_request_starting.connect((frame, resource, request) => {
            stdout.printf("->%s\n", request.uri);
            var scheme = Uri.parse_scheme (resource.uri);
            if (scheme == "system") {
                var uri = translate_uri (resource.uri);
                stdout.printf("->%s\n", uri);
                request.set_uri(uri);
            }
        });

    }
}
