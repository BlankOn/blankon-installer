using Gtk;

int main (string[] args) {

    Gtk.init (ref args);

    Window w = new Window ();
    Installer i = new Installer ();

    w.add (i);

    var p = Parted.get_devices_json(); 
    stdout.printf("->%s\n", p);

    w.show_all ();
    w.fullscreen();
    w.move(0, 0);
    var screen = Gdk.Screen.get_default();
    w.resize(screen.width(), screen.height());
    i.start();
    Gtk.main ();
    return 0;
}
