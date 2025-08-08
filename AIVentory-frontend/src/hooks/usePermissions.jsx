import { useMemo } from 'react';
import { useAuth } from './useAuth.jsx';
import { PERMISSIONS, USER_ROLES, SIDEBAR_MENUS } from '../utils/constants';


export const usePermissions = () => {
  const { user } = useAuth();


  const userPermissions = useMemo(() => {
    if (!user || !user.role) return [];
    return PERMISSIONS[user.role] || [];
  }, [user]);

 
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

 
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };


  const isAdmin = useMemo(() => {
    return user?.role === USER_ROLES.ADMIN;
  }, [user]);


  const isManager = useMemo(() => {
    return user?.role === USER_ROLES.MANAGER;
  }, [user]);

 
  const isEmployee = useMemo(() => {
    return user?.role === USER_ROLES.EMPLOYEE;
  }, [user]);

 
  const allowedMenus = useMemo(() => {
    if (!user || !user.role) return [];
    
    const roleMenus = SIDEBAR_MENUS[user.role] || [];
    
    return roleMenus.filter(menu => {
  
      if (menu.permission && !hasPermission(menu.permission)) {
        return false;
      }

   
      if (menu.submenus) {
        const allowedSubmenus = menu.submenus.filter(submenu => 
          hasPermission(submenu.permission)
        );
        
     
        if (allowedSubmenus.length > 0) {
          menu.submenus = allowedSubmenus;
          return true;
        }
        return false;
      }

      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userPermissions]);


  const canAccessPage = (requiredPermissions) => {
    if (!requiredPermissions) return true;
    
    if (Array.isArray(requiredPermissions)) {
      return hasAnyPermission(requiredPermissions);
    }
    
    return hasPermission(requiredPermissions);
  };

  
  const canCreate = (resource) => {
    return hasPermission(`add_${resource}`) || hasPermission(`manage_${resource}`);
  };

  const canRead = (resource) => {
    return hasPermission(`view_${resource}`) || hasPermission(`manage_${resource}`);
  };

  const canUpdate = (resource) => {
    return hasPermission(`edit_${resource}`) || hasPermission(`manage_${resource}`);
  };

  const canDelete = (resource) => {
    return hasPermission(`delete_${resource}`) || hasPermission(`manage_${resource}`);
  };

  // Kullanıcı yönetimi yetkileri
  const canManageUsers = () => {
    return hasPermission('manage_users');
  };

  const canAddUser = () => {
    return hasPermission('add_user');
  };

  const canEditUser = (targetUserId) => {
    // Kendi profilini herkes düzenleyebilir
    if (user?.id === targetUserId) return true;
    
    // Admin herkesi düzenleyebilir
    if (isAdmin) return true;
    
    // Manager sadece employee'ları düzenleyebilir
    if (isManager && hasPermission('edit_user')) return true;
    
    return false;
  };

  const canDeleteUser = (targetUserRole) => {
    if (!hasPermission('delete_user')) return false;
    
 
    if (isAdmin) return true;
    
   
    if (isManager && targetUserRole === USER_ROLES.EMPLOYEE) return true;
    
    return false;
  };


  const canManageProducts = () => {
    return hasPermission('manage_products');
  };

  const canAddProduct = () => {
    return hasPermission('add_product');
  };

  const canEditProduct = () => {
    return hasPermission('edit_product');
  };

  const canDeleteProduct = () => {
    return hasPermission('delete_product');
  };


  const canManageStock = () => {
    return hasPermission('manage_stock');
  };

  const canUpdateStock = () => {
    return hasPermission('update_stock') || hasPermission('manage_stock');
  };

  const canViewStockMovements = () => {
    return hasPermission('manage_stock') || hasPermission('view_reports');
  };


  const canUseAI = () => {
    return hasPermission('ai_analysis');
  };

  const canViewAIRecommendations = () => {
    return hasPermission('ai_recommendations');
  };

 
  const canViewReports = () => {
    return hasPermission('view_reports');
  };

  const canExportReports = () => {
    return hasPermission('export_reports');
  };


  const canManageSettings = () => {
    return hasPermission('manage_settings');
  };

  const canChangePassword = () => {
    return hasPermission('change_password');
  };

  return {
 
    userPermissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    
  
    isAdmin,
    isManager,
    isEmployee,
    
  
    allowedMenus,
    canAccessPage,
    

    canCreate,
    canRead,
    canUpdate,
    canDelete,
    

    canManageUsers,
    canAddUser,
    canEditUser,
    canDeleteUser,
    canManageProducts,
    canAddProduct,
    canEditProduct,
    canDeleteProduct,
    canManageStock,
    canUpdateStock,
    canViewStockMovements,
    canUseAI,
    canViewAIRecommendations,
    canViewReports,
    canExportReports,
    canManageSettings,
    canChangePassword
  };
};

export default usePermissions;