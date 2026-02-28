package com.eren.pact_backend.repository;

import com.eren.pact_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // İleride "kullanıcı adına göre birini bul" demek için bu özel metodu ekliyoruz
    User findByUsername(String username);
}