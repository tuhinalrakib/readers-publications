function randomIdGenerator(length=10) {
    return Math.random().toString(36).substring(2, 2 + length);
}

function isAdminUser(user) {
    if (!user) return false;
    return Boolean(
        user.is_staff ||
        user.is_superuser ||
        user.role === 'admin' ||
        user.role === 'ADMIN' ||
        user.role === 'staff' ||
        user.role === 'STAFF'
    );
}

export { randomIdGenerator, isAdminUser }
