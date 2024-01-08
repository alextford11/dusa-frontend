export interface CategoryItem {
    id: string;
    name: string;
    records_value_sum: string;
}

export interface Category {
    id: string;
    name: string;
    nsfw: boolean;
    category_items: CategoryItem[];
}
