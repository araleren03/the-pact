package com.eren.pact_backend;

import com.eren.pact_backend.entity.Friendship;
import com.eren.pact_backend.entity.Pact;
import com.eren.pact_backend.entity.User;
import com.eren.pact_backend.repository.FriendshipRepository;
import com.eren.pact_backend.repository.PactRepository;
import com.eren.pact_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PactBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PactBackendApplication.class, args);
	}

	// DİKKAT: Bütün repository'ler buradaki parantezin içine eklendi!
	@Bean
	public CommandLineRunner initData(PactRepository pactRepository, UserRepository userRepository, FriendshipRepository friendshipRepository) {
		return args -> {

			// 1. KULLANICI TOHUMLAMA
			if (userRepository.count() == 0) {
				User user1 = new User();
				user1.setUsername("eren");
				user1.setDisplayName("Eren");
				userRepository.save(user1);

				User user2 = new User();
				user2.setUsername("jacqueline");
				user2.setDisplayName("Jacqueline");
				userRepository.save(user2);

				System.out.println("✅ İlk kullanıcılar (@eren ve @jacqueline) sisteme katıldı!");
			}

			// 2. İDDİA TOHUMLAMA
			if (pactRepository.count() == 0) {
				Pact firstPact = new Pact();
				firstPact.setTitleTr("Mewing ve Tech Neck Duruşu");
				firstPact.setTitleEn("Mewing & Tech Neck Posture");
				firstPact.setTitleEs("Postura de Mewing y Tech Neck");

				firstPact.setChallengerName("Eren");
				firstPact.setOpponentName("Jacqueline");
				firstPact.setOpponentInitial("J");
				firstPact.setStatus("WAITING_ACTION");

				pactRepository.save(firstPact);
				System.out.println("✅ İlk efsanevi iddia veritabanına başarıyla eklendi!");
			}

			// 3. ARKADAŞLIK TOHUMLAMA
			if (friendshipRepository.count() == 0) {
				Friendship f1 = new Friendship();
				f1.setUsername("eren");
				f1.setFriendUsername("jacqueline");
				f1.setStatus("ACCEPTED");
				friendshipRepository.save(f1);

				System.out.println("✅ Eren ve Jacqueline artık resmen arkadaş!");
			}
		}; // <-- Eksik olan o meşhur parantez ve noktalı virgül burada!
	}
}