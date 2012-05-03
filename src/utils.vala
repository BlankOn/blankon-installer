using JSCore;
using Gtk;

namespace Utils {
    public static void write_simple_file (string path, string content) {
        try {
            var file = File.new_for_path (path);
            if (file.query_exists ()) {
                file.delete ();
            }
            var dos = new DataOutputStream (file.create (FileCreateFlags.REPLACE_DESTINATION));
            dos.put_string (content);
            dos.close ();
        } catch (Error e) {
            stderr.printf ("Error writing to %s: %s\n", path, e.message);
        }
    }

    public static JSCore.Value js_get_icon_path (Context ctx,
            JSCore.Object function,
            JSCore.Object thisObject,
            JSCore.Value[] arguments,
            out JSCore.Value exception) {

        exception = null;
        if (arguments.length > 0) {
            var s = arguments [0].to_string_copy (ctx, null);
            char[] buffer = new char[s.get_length() + 1];
            s.get_utf8_c_string (buffer, buffer.length);

            int size = 24;
            if (arguments.length > 1) {
                var size_d = arguments [1].to_number (ctx, null);
                size = (int) size_d;            
            }

            s = new String.with_utf8_c_string (get_icon_path((string) buffer, size));
            var result = new JSCore.Value.string (ctx, s);
            s = null;
            buffer = null;
            return result;
        }

        return new JSCore.Value.undefined (ctx);
    }

    static const JSCore.StaticFunction[] js_funcs = {
        { "getIconPath", js_get_icon_path, PropertyAttribute.ReadOnly },
        { null, null, 0 }
    };


    static const ClassDefinition js_class = {
        0,
        ClassAttribute.None,
        "Utils",
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
        var s = new String.with_utf8_c_string ("Utils");
        g.set_property (context, s, o, PropertyAttribute.None, null);
    }

    public static string get_icon_path (string name, int size=24) {
        var icon = IconTheme.get_default ();
        var i = icon.lookup_icon (name, size, IconLookupFlags.GENERIC_FALLBACK);
        if (i != null) {
            return i.get_filename();
        } else {
            return name;
        }
    }


}
