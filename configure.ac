AC_INIT([installer], [0.1.0], [], [installer])
AC_PREFIX_DEFAULT("/usr")
AC_CONFIG_SRCDIR([Makefile.am])
AC_CONFIG_HEADERS(config.h)
AM_INIT_AUTOMAKE([dist-bzip2])
AM_MAINTAINER_MODE

AC_PROG_CC
AM_PROG_CC_C_O
AC_DISABLE_STATIC
AC_PROG_LIBTOOL

AM_PROG_VALAC([0.14.0])
AC_ARG_ENABLE([devel], AC_HELP_STRING([--enable-devel],[Enable development mode with system dir in current directory]), USE_DEVEL="$enableval", USE_DEVEL="no")
if test $USE_DEVEL = yes ; then
AC_DEFINE_UNQUOTED(SYSTEM_PATH, "$PWD/system", [Location of the JS scripts])
AC_SUBST(SYSTEM_PATH)
else
AC_DEFINE(SYSTEM_PATH, "/usr/lib/blankon-installer/system", [Location of the JS scripts])
AC_SUBST(SYSTEM_PATH)
fi



AH_TEMPLATE([GETTEXT_PACKAGE], [Package name for gettext])
GETTEXT_PACKAGE=blankon-installer
AC_DEFINE_UNQUOTED(GETTEXT_PACKAGE, "$GETTEXT_PACKAGE")
AC_SUBST(GETTEXT_PACKAGE)
AM_GLIB_GNU_GETTEXT
IT_PROG_INTLTOOL([0.35.0])

AC_SUBST(CFLAGS)
AC_SUBST(CPPFLAGS)
AC_SUBST(LDFLAGS)

GLIB_REQUIRED=2.12.0
GTK_REQUIRED=3.0.8
ATK_REQUIRED=2.0.0
GEE_REQUIRED=0.6.1
WEBKIT_REQUIRED=1.3.0
SOUP_REQUIRED=2.3.4


PKG_CHECK_MODULES(INSTALLER, glib-2.0 >= $GLIB_REQUIRED gobject-2.0 >= $GLIB_REQUIRED gtk+-3.0 >= $GTK_REQUIRED atk >= $ATK_REQUIRED gee-1.0 >= $GEE_REQUIRED webkitgtk-3.0 >= $WEBKIT_REQUIRED libsoup-2.4 >= $SOUP_REQUIRED libparted >= 2.3)

AC_SUBST(INSTALLER_CFLAGS)
AC_SUBST(INSTALLER_LIBS)

VALA_PACKAGES="--pkg atk --pkg gdk-x11-3.0 --pkg gee-1.0 --pkg gtk+-3.0 --pkg gio-unix-2.0 --pkg gdk-3.0 --pkg webkit-1.0 --pkg libsoup-2.4 --pkg parted --pkg javascriptcore"

AC_SUBST(VALA_PACKAGES)


AC_CONFIG_FILES([Makefile
	src/Makefile
    scripts/Makefile
    system/Makefile
    po/Makefile.in
	])

AC_OUTPUT
