# Greedy Meshing Javascript Demo

### Greedy Meshing is a concept meant to adapt voxels, which are hard to compute, into large quads, making them easier and in many cases possible at all. <br/>
Note: This example uses iteration per block for the column comparisons necessary for 2nd dimension (in this case x axis) expansion which is **NOT** the optimal method in terms of performance.
In the future, if asked I might create an example of efficiently doing it via bitwise operators, but to be very honest there are much better languages (e.g. C/C++, Rust, etc.) for demonstrating that and countless examples in them too.

This demo generates an image out of noise and then greedily meshes it into rectangles.
![Greedy Meshing Image](https://github.com/user-attachments/assets/0e0366c8-df27-45e5-8cf5-7597427ca0ae)

If you'd like to see how expanding down one dimension (in this demo the `y`) before expanding that down the other dimension (in this demo the `x`) works just enable the `DEBUG_VISUALS` to see <br/>
![Greedy Meshing DEBUG_VISUALS Image](https://github.com/user-attachments/assets/454a1ddd-a9db-4808-a01e-e7401f01500f)
