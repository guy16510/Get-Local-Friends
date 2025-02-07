import React from 'react';

interface SearchFiltersProps {
  filters: {
    hasKids: boolean;
    drinksAlcohol: boolean;
    isMarried: boolean;
  };
  onChange: (name: string, value: boolean) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onChange }) => (
  <div style={{ margin: '1rem 0' }}>
    <label>
      <input
        type="checkbox"
        checked={filters.hasKids}
        onChange={(e) => onChange('hasKids', e.target.checked)}
      />
      Has Kids
    </label>
    <label>
      <input
        type="checkbox"
        checked={filters.drinksAlcohol}
        onChange={(e) => onChange('drinksAlcohol', e.target.checked)}
      />
      Drinks Alcohol
    </label>
    <label>
      <input
        type="checkbox"
        checked={filters.isMarried}
        onChange={(e) => onChange('isMarried', e.target.checked)}
      />
      Married
    </label>
  </div>
);

export default SearchFilters;