#!/usr/bin/env python3
# filepath: /Users/yelyzavetalysova/Documents/GitHub/Trail_Tail/backend/verify_providers.py
"""
This script validates that the provider pattern has been correctly implemented.
It checks that providers are registered properly and that routes are using the providers.
"""

import importlib
import inspect
import sys
from pathlib import Path

def check_providers_imported():
    """Check if provider interfaces are imported correctly."""
    print("Checking provider interfaces...")
    
    # List of expected provider interfaces
    provider_interfaces = [
        'app.providers.interfaces.routes_provider',
        'app.providers.interfaces.narratives_provider',
        'app.providers.interfaces.ar_encounters_provider',
        'app.providers.interfaces.safety_provider',
        'app.providers.interfaces.users_provider',
    ]
    
    success = True
    for provider_interface in provider_interfaces:
        try:
            module = importlib.import_module(provider_interface)
            print(f"✅ Successfully imported {provider_interface}")
            
            # Check if the module has a class that ends with "Provider"
            found_provider_class = False
            for name, obj in inspect.getmembers(module):
                if inspect.isclass(obj) and name.endswith('Provider'):
                    found_provider_class = True
                    print(f"  - Found provider interface class: {name}")
                    
                    # Check if the class has abstract methods
                    abstract_methods = [method for method, _ in inspect.getmembers(obj) 
                                       if not method.startswith('_') and inspect.isfunction(getattr(obj, method))]
                    if abstract_methods:
                        print(f"  - Has methods: {', '.join(abstract_methods)}")
                    else:
                        print(f"  ⚠️ No methods found in interface {name}")
                        success = False
                    break
            
            if not found_provider_class:
                print(f"⚠️ No provider interface class found in {provider_interface}")
                success = False
                
        except ImportError as e:
            print(f"❌ Failed to import {provider_interface}: {e}")
            success = False
    
    return success

def check_mock_providers():
    """Check if mock implementations exist and implement their interfaces."""
    print("\nChecking mock implementations...")
    
    # List of expected mock providers
    mock_providers = [
        ('app.providers.mock.mock_routes_provider', 'app.providers.interfaces.routes_provider.RoutesProvider'),
        ('app.providers.mock.mock_narratives_provider', 'app.providers.interfaces.narratives_provider.NarrativesProvider'),
        ('app.providers.mock.mock_ar_encounters_provider', 'app.providers.interfaces.ar_encounters_provider.ArEncountersProvider'),
        ('app.providers.mock.mock_safety_provider', 'app.providers.interfaces.safety_provider.SafetyProvider'),
        ('app.providers.mock.mock_users_provider', 'app.providers.interfaces.users_provider.UsersProvider'),
    ]
    
    success = True
    for mock_module_name, interface_path in mock_providers:
        try:
            mock_module = importlib.import_module(mock_module_name)
            
            # Get the interface class
            interface_parts = interface_path.split('.')
            interface_module = importlib.import_module('.'.join(interface_parts[:-1]))
            interface_class = getattr(interface_module, interface_parts[-1])
            
            # Find implementation class in mock module
            found_implementation = False
            for name, obj in inspect.getmembers(mock_module):
                if inspect.isclass(obj) and name.startswith('Mock') and issubclass(obj, interface_class):
                    found_implementation = True
                    print(f"✅ {name} correctly implements {interface_parts[-1]}")
                    
                    # Check that all interface methods are implemented
                    interface_methods = [method for method, _ in inspect.getmembers(interface_class) 
                                        if not method.startswith('_') and inspect.isfunction(getattr(interface_class, method))]
                    
                    missing_methods = []
                    for method in interface_methods:
                        if not hasattr(obj, method) or not callable(getattr(obj, method)):
                            missing_methods.append(method)
                    
                    if missing_methods:
                        print(f"  ⚠️ Missing method implementations: {', '.join(missing_methods)}")
                        success = False
                    else:
                        print(f"  - All required methods are implemented")
                    break
            
            if not found_implementation:
                print(f"❌ No implementation found for {interface_parts[-1]} in {mock_module_name}")
                success = False
                
        except ImportError as e:
            print(f"❌ Failed to import {mock_module_name} or {interface_path}: {e}")
            success = False
            
        except AttributeError as e:
            print(f"❌ {e}")
            success = False
    
    return success

def check_provider_factory():
    """Check if provider factory is set up correctly."""
    print("\nChecking provider factory...")
    
    try:
        from app.providers.provider_factory import ProviderFactory
        
        # Check if all getter methods exist
        expected_getters = [
            'get_routes_provider',
            'get_narratives_provider',
            'get_ar_encounters_provider',
            'get_safety_provider',
            'get_users_provider',
        ]
        
        success = True
        for getter in expected_getters:
            if hasattr(ProviderFactory, getter) and callable(getattr(ProviderFactory, getter)):
                print(f"✅ ProviderFactory has method: {getter}")
            else:
                print(f"❌ ProviderFactory missing method: {getter}")
                success = False
        
        return success
        
    except ImportError as e:
        print(f"❌ Failed to import ProviderFactory: {e}")
        return False

def check_routes_using_providers():
    """Check if routes are using providers through the factory."""
    print("\nChecking if routes are using providers...")
    
    route_files = [
        'app.routes.routes',
        'app.routes.narratives',
        'app.routes.ar_encounters',
        'app.routes.safety',
        'app.routes.users',
    ]
    
    success = True
    for route_file in route_files:
        try:
            module = importlib.import_module(route_file)
            print(f"Checking {route_file}...")
            
            # Check if the file imports ProviderFactory
            source_code = inspect.getsource(module)
            if "ProviderFactory" in source_code:
                print(f"✅ {route_file} imports ProviderFactory")
                
                # Check if provider getter methods are called
                if "get_routes_provider" in source_code or \
                   "get_narratives_provider" in source_code or \
                   "get_ar_encounters_provider" in source_code or \
                   "get_safety_provider" in source_code or \
                   "get_users_provider" in source_code:
                    print(f"✅ {route_file} uses provider getter methods")
                else:
                    print(f"⚠️ {route_file} imports ProviderFactory but may not use getter methods")
                    success = False
            else:
                print(f"❌ {route_file} does not import ProviderFactory")
                success = False
                
        except ImportError as e:
            print(f"❌ Failed to import {route_file}: {e}")
            success = False
            
        except Exception as e:
            print(f"❌ Error checking {route_file}: {e}")
            success = False
    
    return success

def main():
    """Run all verification checks."""
    # Make sure the script can find the app module
    sys.path.append(str(Path(__file__).parent))
    
    print("==== Trail Tail Provider Pattern Verification ====\n")
    
    interfaces_ok = check_providers_imported()
    mocks_ok = check_mock_providers()
    factory_ok = check_provider_factory()
    routes_ok = check_routes_using_providers()
    
    print("\n==== Verification Summary ====")
    print(f"Provider Interfaces: {'✅ PASS' if interfaces_ok else '❌ FAIL'}")
    print(f"Mock Implementations: {'✅ PASS' if mocks_ok else '❌ FAIL'}")
    print(f"Provider Factory: {'✅ PASS' if factory_ok else '❌ FAIL'}")
    print(f"Routes Using Providers: {'✅ PASS' if routes_ok else '❌ FAIL'}")
    
    all_ok = interfaces_ok and mocks_ok and factory_ok and routes_ok
    print(f"\nOverall: {'✅ PASS - Provider pattern correctly implemented!' if all_ok else '❌ FAIL - Issues found with provider implementation.'}")
    
    return 0 if all_ok else 1

if __name__ == "__main__":
    sys.exit(main())
