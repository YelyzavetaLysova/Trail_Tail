from app.providers.provider_factory import ProviderFactory
from app.providers.mock.mock_routes_provider import MockRoutesProvider
from app.providers.mock.mock_narratives_provider import MockNarrativesProvider
from app.providers.mock.mock_ar_encounters_provider import MockAREncountersProvider
from app.providers.mock.mock_safety_provider import MockSafetyProvider
from app.providers.mock.mock_users_provider import MockUsersProvider

def register_providers():
    """Register all providers with the provider factory"""
    # For now we'll use mock providers for everything
    ProviderFactory.register_routes_provider(MockRoutesProvider())
    ProviderFactory.register_narratives_provider(MockNarrativesProvider())
    ProviderFactory.register_ar_encounters_provider(MockAREncountersProvider())
    ProviderFactory.register_safety_provider(MockSafetyProvider())
    ProviderFactory.register_users_provider(MockUsersProvider())
    
    print("All providers registered successfully!")
