NULL = 

AM_CPPFLAGS = \
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
	$(NULL)

blankon_installer_VALAFLAGS = \
    --vapidir ../vapi \
	--pkg config \
    $(VALA_PACKAGES) \
    $(NULL)

blankon_installer_LDADD = \
	$(INSTALLER_LIBS) \
	$(NULL)

EXTRA_DIST = \
	$(NULL)

DISTCLEANFILES = \
	$(NULL)


