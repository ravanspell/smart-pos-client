
import { QueryParams } from '@/types';
import { Role, RoleResponse } from '@/types/roles';
import { v4 as uuidv4 } from 'uuid';

// Generate 200 mock roles
function generateMockRoles(count: number): Role[] {
  const roles: Role[] = [];
  
  const roleTypes = [
    'Admin',
    'Editor',
    'Viewer',
    'Manager',
    'Analyst',
    'Developer',
    'Tester',
    'Designer',
    'Support',
    'Moderator'
  ];
  
  const resources = [
    'Users',
    'Products',
    'Orders',
    'Reports',
    'Settings',
    'Customers',
    'Inventory',
    'Analytics',
    'Content',
    'Billing',
    'Dashboard',
    'Notifications',
    'Payments',
    'Projects',
    'Tasks',
    'Comments',
    'Categories',
    'Files',
    'Media',
    'System'
  ];
  
  // Generate roles by combining role types and resources
  for (let i = 0; i < count; i++) {
    // If we've generated all combinations, add numbered versions
    let roleTypeIndex = i % roleTypes.length;
    let resourceIndex = Math.floor(i / roleTypes.length) % resources.length;
    
    // Add a counter for cases where we exceed the combinations
    const counter = Math.floor(i / (roleTypes.length * resources.length));
    const counterSuffix = counter > 0 ? ` ${counter}` : '';
    
    const roleType = roleTypes[roleTypeIndex];
    const resource = resources[resourceIndex];
    
    roles.push({
      id: uuidv4(),
      name: `${roleType}:${resource}${counterSuffix}`,
      description: `${roleType} role for ${resource} management${counterSuffix}`
    });
  }
  
  return roles;
}

// Create mock data
export const mockRoles: Role[] = generateMockRoles(200);

// Function to query roles with filtering, sorting, and pagination
export function queryRoles<T extends Role>(params: QueryParams<T>): RoleResponse {
  let result = [...mockRoles];
  
  // Apply filters
  if (params.filter) {
    Object.entries(params.filter).forEach(([key, value]) => {
      if (value) {
        // Case insensitive filtering for strings
        result = result.filter(item => {
          const itemValue = item[key as keyof Role];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          } else {
            return itemValue === value;
          }
        });
      }
    });
  }
  
  // Apply sorting
  if (params.sortBy) {
    const sortBy = params.sortBy as keyof Role;
    result.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0; // Default case if not string (though all our role fields are strings)
    });
  }
  
  // Get total count before pagination
  const totalItems = result.length;
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const paginatedItems = result.slice(startIndex, startIndex + limit);
  
  return {
    items: paginatedItems,
    meta: {
      totalItems,
      itemCount: paginatedItems.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    }
  };
}