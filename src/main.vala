using Gtk;

int main (string[] args) {

    Gtk.init (ref args);

    Window w = new Window ();
    Installer i = new Installer ();

    w.add (i);

    w.show_all ();
    Gtk.main ();
    return 0;
}
