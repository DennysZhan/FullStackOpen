import { useState } from 'react'; // Import useState

const Display = ({ search, countriesList }) => {
    const [selectedCountry, setSelectedCountry] = useState(null); // State for the selected country

    // Memoize filtered countries to avoid re-calculating on every render if inputs haven't changed
    // For simplicity, we'll call it directly, but for optimization, useMemo could be used.
    const getFilteredCountries = () => {
        if (!countriesList || countriesList.length === 0) {
            return [];
        }
        if (!search) {
            return []; // Or return all if you prefer when search is empty
        }
        return countriesList.filter(country =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
        );
    };

    const countriesToDisplay = getFilteredCountries();
    const numberOfMatches = countriesToDisplay.length;

    // Component to display details of a single country
    const ShowCountryDetails = ({ country }) => {
        if (!country) return null;

        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital ? country.capital.join(', ') : 'N/A'}</p>
                <p>Area: {country.area} km²</p>
                <h2>Languages:</h2>
                <ul>
                    {country.languages ? (
                        Object.values(country.languages).map(languageName => (
                            <li key={languageName}>{languageName}</li>
                        ))
                    ) : (
                        <li>No language data available.</li>
                    )}
                </ul>
                {country.flags && country.flags.png && (
                    <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
                )}
            </div>
        );
    };

    // Handler for the "show" button
    const handleShowCountry = (country) => {
        setSelectedCountry(country);
    };

    // If a country is selected by clicking "show", display its details
    if (selectedCountry) {
        return (
            <div>
                <ShowCountryDetails country={selectedCountry} />
                <button onClick={() => setSelectedCountry(null)}>Back to list</button> {/* Optional: button to go back */}
            </div>
        );
    }

    // Existing logic for displaying based on filter results
    if (numberOfMatches > 1) {
        if (numberOfMatches < 11) {
            return (
                <div>
                    {countriesToDisplay.map((country) => (
                        <div key={country.cca3 || country.name.common}>
                            {country.name.common}
                            <button onClick={() => handleShowCountry(country)}>show</button>
                        </div>
                    ))}
                </div>
            );
        } else { // More than 10 matches
            return (
                <div>
                    <p>Too many matches, please specify another filter.</p>
                </div>
            );
        }
    } else if (numberOfMatches === 1) {
        // If only one country matches directly, show its details
        return <ShowCountryDetails country={countriesToDisplay[0]} />;
    } else if (search && numberOfMatches === 0) {
        return <p>No country matches your search criteria.</p>;
    } else {
        return <p>Enter a country name to search.</p>;
    }
};

export default Display;