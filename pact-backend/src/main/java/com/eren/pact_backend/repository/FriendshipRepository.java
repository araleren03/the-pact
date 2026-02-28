package com.eren.pact_backend.repository;

import com.eren.pact_backend.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    // Eren'in "Kabul Edilmiş" arkadaşlarını getirecek o sihirli SQL metodu
    List<Friendship> findByUsernameAndStatus(String username, String status);
}