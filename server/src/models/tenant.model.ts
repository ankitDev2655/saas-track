export interface Tenant {
    id?: number;          // Auto-incremented primary key
    name: string;         // Unique tenant name
    schema_name: string;  // Schema name for multi-tenancy
    created_by?: number;  // Foreign key (user who created the tenant)
    created_at?: Date;    // Auto-generated timestamp
}
