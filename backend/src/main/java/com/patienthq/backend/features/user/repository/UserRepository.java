package com.patienthq.backend.features.user.repository;

import com.patienthq.backend.features.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    @Query("""
        SELECT u FROM User u
        WHERE u.username = :username
    """)
    Optional<User> findByUsernameWithRole(String username);
}
