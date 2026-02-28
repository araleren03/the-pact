package com.eren.pact_backend.repository;
import com.eren.pact_backend.entity.Pact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PactRepository extends JpaRepository<Pact, Long> {
    // İçine tek satır kod yazmamıza gerek yok!
    // JpaRepository bizim için Kaydetme, Silme, Bulma gibi tüm SQL komutlarını arka planda otomatik yazar.
}
