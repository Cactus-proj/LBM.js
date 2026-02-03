
EMCC ?= em++
# STACK_SIZE=256kB;  INITIAL_MEMORY=64MB
EMCC_FLAGS ?= -O2 -sSTACK_SIZE=262144 -sINITIAL_MEMORY=67108864 -sALLOW_MEMORY_GROWTH=1 
EMCC_BIND = --bind -sEXPORTED_FUNCTIONS=['_malloc','_free'] -sEXPORTED_RUNTIME_METHODS=['HEAPF32']

all: lbm

lbm: lbm.cpp lbm_wrapper.js
	$(EMCC) $(EMCC_FLAGS) $(EMCC_BIND) --pre-js lbm_wrapper.js lbm.cpp -o lbm.js
