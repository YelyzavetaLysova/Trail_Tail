from app.providers.provider_factory import ProviderFactory
from app.providers.mock.mock_routes_provider import MockRoutesProvider
from app.providers.mock.mock_narratives_provider import MockNarrativesProvider
from app.providers.mock.mock_ar_encounters_provider import MockAREncountersProvider
from app.providers.mock.mock_safety_provider import MockSafetyProvider
from app.providers.mock.mock_users_provider import MockUsersProvider
from app.core.logging.logger import get_logger
from app.core.config import get_settings
from app.core.errors.exceptions import ConfigurationError

# Initialize logger
logger = get_logger(__name__)

def register_providers():
    """
    Register all providers with the provider factory
    
    This function initializes and registers all service providers based on 
    the current configuration settings. In a production environment, this would
    use real implementations instead of mocks.
    
    Raises:
        ConfigurationError: If there's an issue with provider registration
    """
    settings = get_settings()
    logger.info(f"Registering providers in environment: {settings.ENVIRONMENT}")
    
    try:
        # For now we'll use mock providers for everything
        # In a real environment, this would select the appropriate implementation
        # based on configuration settings
        
        ProviderFactory.register_routes_provider(MockRoutesProvider())
        ProviderFactory.register_narratives_provider(MockNarrativesProvider())
        ProviderFactory.register_ar_encounters_provider(MockAREncountersProvider())
        ProviderFactory.register_safety_provider(MockSafetyProvider())
        ProviderFactory.register_users_provider(MockUsersProvider())
        
        logger.info("All providers registered successfully!")
        
    except Exception as e:
        logger.error(f"Error registering providers: {str(e)}", exc_info=True)
        raise ConfigurationError(
            message="Failed to register service providers",
            details={"error": str(e)}
        )
