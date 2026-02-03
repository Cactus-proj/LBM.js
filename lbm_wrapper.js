var Module = {
    onRuntimeInitialized: function() {
        this.print("Module loaded.");
    },
    print: function(text) {
        const outputDiv = document.getElementById('output');
        if (outputDiv) {
            outputDiv.innerHTML += text + "\n";
        }
        console.log(text);
    }
};

function runSimulation(Module, n = 100, m = 100, mstep = 1000) {
    const print = Module.print;
    const nx = n + 1;
    const ny = m + 1;
    const floatSize = 4;

    // Calculate sizes
    const size_f = 9 * nx * ny * floatSize;
    const size_rho = nx * ny * floatSize;
    const size_u = nx * ny * floatSize;
    const size_v = nx * ny * floatSize;
    const size_vel = nx * ny * floatSize;
    const size_x = nx * floatSize;
    const size_y = ny * floatSize;

    print("Allocating memory...");

    // Allocate memory using _malloc
    const ptr_f = Module._malloc(size_f);
    const ptr_rho = Module._malloc(size_rho);
    const ptr_u = Module._malloc(size_u);
    const ptr_v = Module._malloc(size_v);
    const ptr_vel = Module._malloc(size_vel);
    const ptr_x = Module._malloc(size_x);
    const ptr_y = Module._malloc(size_y);

    if (!ptr_f || !ptr_rho || !ptr_u || !ptr_v || !ptr_vel || !ptr_x || !ptr_y) {
        throw new Error("Memory allocation failed");
    }

    print("Running simulation...");

    // Call the bound function
    // Note: The C++ function expects uintptr_t which maps to number in JS
    Module.lid_driven_flow(n, m, mstep, ptr_f, ptr_rho, ptr_u, ptr_v, ptr_vel, ptr_x, ptr_y);

    print("Simulation completed.");
    
    // Optional: Read back some data to verify
    // Access heap via Module.HEAPF32
    // Pointers are byte offsets, divide by 4 to get float index
    const velocityArray = Module.HEAPF32.subarray(ptr_vel / 4, ptr_vel / 4 + nx * ny);
    
    // Print center velocity as a check
    const centerX = Math.floor(n / 2);
    const centerY = Math.floor(m / 2);
    const centerIdx = centerX * (m + 1) + centerY; // Note: Access pattern in C++ is [i][j], usually mapped to flat array
    // But C++ array [101][101] is contiguous. i is first dim, j is second.
    // address = base + (i * 101 + j) * 4 ?
    // Wait, C++ `float velocity[n+1][m+1]`
    // Memory layout is row-major in C++: velocity[i] is the i-th row.
    // velocity[i][j] is at offset (i * (m+1) + j).
    
    const centerVal = velocityArray[centerIdx];
    print(`Center Velocity (approx check): ${centerVal}`);


    // Free memory
    Module._free(ptr_f);
    Module._free(ptr_rho);
    Module._free(ptr_u);
    Module._free(ptr_v);
    Module._free(ptr_vel);
    Module._free(ptr_x);
    Module._free(ptr_y);
    
    print("Memory freed.");
}