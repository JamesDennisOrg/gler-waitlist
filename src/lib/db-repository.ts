import { mockProviders, ServiceProvider } from '@/data/mock-providers';

export interface FilterParams {
  page?: string;
  search?: string;
  postcode?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  vendorType?: string;
  serviceOffering?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getPaginatedProviders(params: FilterParams) {
  // Simulate database network indexing latency (~60ms)
  await new Promise((resolve) => setTimeout(resolve, 60));

  let records = [...mockProviders];

  // 1. Partial Live Search (Email, Phone, Postcode matching)
  if (params.search) {
    const searchLower = params.search.toLowerCase().trim().replace(/\s+/g, '');
    records = records.filter(
      (p) =>
        p.email.toLowerCase().includes(searchLower) ||
        p.phone.replace(/\s+/g, '').includes(searchLower) ||
        p.postcode.toLowerCase().replace(/\s+/g, '').includes(searchLower)
    );
  }

  // 2. Sidebar Dedicated Filters
  if (params.postcode) {
    const postLower = params.postcode.toLowerCase().trim();
    records = records.filter((p) => p.postcode.toLowerCase().includes(postLower));
  }
  if (params.status && params.status !== 'all') {
    records = records.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase());
  }
  if (params.vendorType && params.vendorType !== 'all') {
    records = records.filter((p) => p.vendorType.toLowerCase() === params.vendorType?.toLowerCase());
  }
  if (params.serviceOffering && params.serviceOffering !== 'all') {
    records = records.filter((p) => p.serviceOffering.toLowerCase() === params.serviceOffering?.toLowerCase());
  }
  
  // Chronological Range Filtering (MM/DD/YYYY to Date object translation)
  if (params.startDate || params.endDate) {
    const start = params.startDate ? new Date(params.startDate) : null;
    const end = params.endDate ? new Date(params.endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    records = records.filter((p) => {
      const recordDate = new Date(p.signupDate);
      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      return true;
    });
  }

  // 3. Dynamic Multi-Column Sorting
  const sortBy = (params.sortBy || 'signupDate') as keyof ServiceProvider;
  const sortOrder = params.sortOrder || 'desc';

  records.sort((a, b) => {
    let valA = a[sortBy].toLowerCase();
    let valB = b[sortBy].toLowerCase();

    if (sortBy === 'signupDate') {
      valA = new Date(a.signupDate).getTime().toString();
      valB = new Date(b.signupDate).getTime().toString();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // 4. Server Slicing Engine (10 elements per page constraint)
  const page = parseInt(params.page || '1', 10);
  const limit = 10;
  const totalItems = records.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const paginatedData = records.slice(offset, offset + limit);

  return {
    data: paginatedData,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };
}
