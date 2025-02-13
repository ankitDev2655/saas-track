export interface TenantAdmin {
    id?: number;
    tenant_id: number;
    user_id: number;
    assigned_by: number;
    assigned_at?: Date;
}
