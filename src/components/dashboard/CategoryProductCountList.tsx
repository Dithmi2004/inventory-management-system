interface CategoryProductCount {
  id: string;
  name: string;
  productCount: number;
}

interface CategoryProductCountListProps {
  categories: CategoryProductCount[];
}

const CategoryProductCountList = ({
  categories,
}: CategoryProductCountListProps) => {
  return (
    <section className="dashboard-section category-count-section">
      <div className="dashboard-section-header">
        <h3>Products per Category</h3>
        <span>{categories.length} categories</span>
      </div>

      {categories.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>No categories available.</p>
        </div>
      ) : (
        <div className="category-count-list">
          {categories.map((category) => (
            <div key={category.id} className="category-count-item">
              <span>{category.name}</span>
              <strong>
                {category.productCount}
                {category.productCount === 1 ? " product" : " products"}
              </strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryProductCountList;
