package com.mercury.palaver.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String INSTITUTION = "ROLE_INSTITUTION";

    public static final String PARTICIPANT = "ROLE_PARTICIPANT";

    public static final String GROUP = "ROLE_GROUP";
    public static final String SUBADMIN = "ROLE_SUBADMIN";

    private AuthoritiesConstants() {
    }
}
