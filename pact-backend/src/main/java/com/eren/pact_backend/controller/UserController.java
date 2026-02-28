package com.eren.pact_backend.controller;

import com.eren.pact_backend.entity.User;
import com.eren.pact_backend.entity.Friendship;
import com.eren.pact_backend.repository.UserRepository;
import com.eren.pact_backend.repository.FriendshipRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    public UserController(UserRepository userRepository, FriendshipRepository friendshipRepository) {
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
    }

    // Telefona (React Native) kullanıcının arkadaşlarını liste olarak gönderir
    @GetMapping("/{username}/friends")
    public List<User> getFriends(@PathVariable String username) {
        // 1. Veritabanından Eren'in kabul edilmiş arkadaşlarını bul
        List<Friendship> friendships = friendshipRepository.findByUsernameAndStatus(username, "ACCEPTED");

        // 2. Bu arkadaşların kullanıcı adlarını alıp, tam profil (User) objelerine dönüştür ve gönder
        return friendships.stream()
                .map(f -> userRepository.findByUsername(f.getFriendUsername()))
                .collect(Collectors.toList());
    }
}