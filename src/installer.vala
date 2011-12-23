using Gtk;
using GLib;
using WebKit;
using Soup;

public class Handler : Soup.Request {
    const string[] schemes_served = { "parted", null };

    long length;

    static construct {
        schemes = schemes_served;
    }


    public override GLib.InputStream send (GLib.Cancellable? cancellable) {
         
        var result = Parted.process_request (get_uri().to_string (false)) + "";
        stdout.printf(">%s<\n", result);
        length = result.length;
        return new MemoryInputStream.from_data ((uint8[])result.to_utf8(), null);
    }

    public override long get_content_length () {
        return length;
    }

    public override string get_content_type () {
        return "application/json";
    }
}



public class Installer : WebView {

    string translate_uri (string old) {
        var uri = old.replace("http://system", "file://" + Config.SYSTEM_PATH + "/");
        return uri;
    }

    string translate_parted (string old) {
        var uri = old.replace("http://parted/", "parted:");
        return uri;
    }

    public Installer () {
        var settings = new WebSettings();
        settings.enable_file_access_from_file_uris = true;
        settings.enable_universal_access_from_file_uris = true;
        set_settings(settings);
        var session = WebKit.get_default_session ();
        var requester = new Requester();
        session.add_feature = requester;
        requester.add_feature(typeof(Handler));

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
