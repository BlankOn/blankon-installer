using Gtk;

int main (string[] args) {
    Intl.setlocale(LocaleCategory.ALL, "");
    Intl.bindtextdomain( Config.GETTEXT_PACKAGE, Config.LOCALEDIR );
    Intl.bind_textdomain_codeset( Config.GETTEXT_PACKAGE, "UTF-8" );
    Intl.textdomain( Config.GETTEXT_PACKAGE );
    Gtk.init (ref args);

    Window w = new Window ();
    Installer i = new Installer ();

    w.add (i);

    w.show_all ();
    w.fullscreen();
    w.move(0, 0);
    var screen = Gdk.Screen.get_default();
    w.resize(screen.width(), screen.height());
    i.start();
    Gtk.main ();
    return 0;
}
