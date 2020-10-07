INPUT_FILES = $(basename $(shell find . -name '*.svg'))

.PHONY: all
all: $(addsuffix .png, $(INPUT_FILES))

.PHONY: %.png
%.png: %.svg
	inkscape -z -e $@ -w 72 -h 72 $<
