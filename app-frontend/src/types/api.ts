export interface Transaction {
  id: string;
  start_date: string;
  description: string;
  amount: number;
  currency: string;
  category_id?: number | null;
  category_name?: string | null;
  flow_type?: string | null;
  flow_sub_type?: string | null;
  is_recurrent?: boolean | null;
}

export interface Category {
  id: number;
  flow_type: string;
  flow_sub_type: string;
  category: string;
  is_recurrent: boolean;
}

export interface DashboardMetrics {
  total_income: number;
  total_expense: number;
  net_cashflow: number;
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface UploadResponse {
  success: boolean;
  inserted?: number;
  errors?: string[];
}
