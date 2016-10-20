#include <iostream>
#include <string>

int main ()
{
	std::string name;
	while(true) {
		std::getline (std::cin,name);
		std::cout << name << std::endl << std::endl;
	}
	return 0;
}