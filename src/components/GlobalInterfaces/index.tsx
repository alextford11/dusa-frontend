export interface CategoryItem {
    id: string;
    name: string;
    records_value_sum: string;
}

export interface Category {
    id: string;
    name: string;
    category_items: CategoryItem[];
}
