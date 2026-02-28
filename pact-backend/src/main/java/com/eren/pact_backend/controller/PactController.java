package com.eren.pact_backend.controller;
import com.eren.pact_backend.entity.Pact;
import com.eren.pact_backend.repository.PactRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacts")
@CrossOrigin(origins = "*") // Çok önemli: React Native (Telefondan) gelen istekleri güvenlik duvarı engellemesin diye bunu ekliyoruz.
public class PactController {

    private final PactRepository pactRepository;

    public PactController(PactRepository pactRepository) {
        this.pactRepository = pactRepository;
    }

    // Telefona BÜTÜN iddiaları liste halinde gönderen API Ucu
    @GetMapping
    public List<Pact> getAllPacts() {
        return pactRepository.findAll();
    }

    // Telefondan gelen YENİ bir iddiayı veritabanına kaydeden API Ucu
    @PostMapping
    public Pact createPact(@RequestBody Pact newPact) {
        newPact.setStatus("WAITING_ACTION"); // Yeni bir iddia açıldığında varsayılan durumu belirledik
        return pactRepository.save(newPact);
    }
    // İddianın durumunu (status) güncelleyen yepyeni API ucumuz
    @PutMapping("/{id}/status")
    public Pact updatePactStatus(@PathVariable Long id, @RequestParam String newStatus) {
        // 1. Önce ID'sine göre o iddiayı veritabanından bul
        Pact existingPact = pactRepository.findById(id).orElseThrow(() -> new RuntimeException("İddia bulunamadı!"));

        // 2. Durumunu yeni gelen durumla (örn: COMPLETED) değiştir
        existingPact.setStatus(newStatus);

        // 3. Değişikliği veritabanına kalıcı olarak kaydet
        return pactRepository.save(existingPact);
    }
}
