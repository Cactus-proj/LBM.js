
EMCC ?= em++
# STACK_SIZE=256kB;  INITIAL_MEMORY=64MB
EMCC_FLAGS ?= -O2 -sSTACK_SIZE=262144 -sINITIAL_MEMORY=67108864 -sALLOW_MEMORY_GROWTH=1 
EMCC_BIND = --bind -sEXPORTED_FUNCTIONS=['_malloc','_free','_main'] -sEXPORTED_RUNTIME_METHODS=['HEAPF32']

all: lbm_js

lbm: lbm.cpp
	$(EMCC) $(EMCC_FLAGS) lbm.cpp -o index.html

lbm_js: lbm.cpp
	$(EMCC) $(EMCC_FLAGS) $(EMCC_BIND) lbm.cpp -o lbm.js
