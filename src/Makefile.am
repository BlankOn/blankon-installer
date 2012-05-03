NULL = 

AM_CPPFLAGS = \
    -DLIBSOUP_USE_UNSTABLE_REQUEST_API \
	$(INSTALLER_CFLAGS) \
	-include config.h \
	-DLOCALEDIR=\""$(localedir)"\" \
	-DPKGDATADIR=\""$(pkgdatadir)"\" \
	$(NULL)

bin_PROGRAMS = blankon-installer

blankon_installer_SOURCES = \
    main.vala \
	installer.vala \
	parted.vala \
    utils.vala \
	$(NULL)

blankon_installer_VALAFLAGS = \
    --vapidir ../vapi \
	--pkg config \
    $(VALA_PACKAGES) \
    $(NULL)

blankon_installer_LDADD = \
	$(INSTALLER_LIBS) \
	$(NULL)

desktopdir = $(prefix)/share/applications
dist_desktop_DATA = blankon-installer.desktop

EXTRA_DIST = \
	$(NULL)

DISTCLEANFILES = \
	$(NULL)


