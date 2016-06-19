NULL = 

AM_CPPFLAGS = \
    -DLIBSOUP_USE_UNSTABLE_REQUEST_API \
	$(INSTALLER_CFLAGS) \
	-include config.h \
	-DLOCALEDIR=\""$(localedir)"\" \
	-DPKGDATADIR=\""$(pkgdatadir)"\" \
	$(NULL)

bin_PROGRAMS = transaction

transaction_SOURCES = \
					  transaction.vala \
					  parted.vala \
					  $(NULL)


transaction_VALAFLAGS = \
						--vapidir ../../vapi \
						--pkg config \
						$(VALA_PACKAGES) \
						$(NULL)

transaction_LDADD = \
					$(INSTALLER_LIBS) \
					$(NULL)


