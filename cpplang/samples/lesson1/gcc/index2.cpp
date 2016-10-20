#include<iostream>
#include<vector>
#include<numeric>
#include<algorithm>
int main() {
	std::vector<int> V(10);
 	// Use std::iota to create a sequence of integers 0, 1, ...
	std::iota(V.begin(), V.end(), 1);
	// Print the unsorted data using std::for_each and a lambda
	std::cout << "Original data" << std::endl;
	std::for_each(V.begin(), V.end(), [](auto i) { std::cout << i << " "; });
	std::cout << std::endl;
	// Sort the data using std::sort and a lambda
	std::sort(V.begin(), V.end(), [](auto i, auto j) { return (i > j); });
	// Print the sorted data using std::for_each and a lambda
	std::cout << "Sorted data" << std::endl;
	std::for_each(V.begin(), V.end(), [](auto i) { std::cout << i << " "; });
	std::cout << std::endl;
	return 0;
}