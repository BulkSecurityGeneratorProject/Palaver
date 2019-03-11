package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.BalanceAccount;
import com.mercury.palaver.repository.BalanceAccountRepository;
import com.mercury.palaver.web.rest.errors.BadRequestAlertException;
import com.mercury.palaver.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing BalanceAccount.
 */
@RestController
@RequestMapping("/api")
public class BalanceAccountResource {

    private final Logger log = LoggerFactory.getLogger(BalanceAccountResource.class);

    private static final String ENTITY_NAME = "balanceAccount";

    private final BalanceAccountRepository balanceAccountRepository;

    public BalanceAccountResource(BalanceAccountRepository balanceAccountRepository) {
        this.balanceAccountRepository = balanceAccountRepository;
    }

    /**
     * POST  /balance-accounts : Create a new balanceAccount.
     *
     * @param balanceAccount the balanceAccount to create
     * @return the ResponseEntity with status 201 (Created) and with body the new balanceAccount, or with status 400 (Bad Request) if the balanceAccount has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/balance-accounts")
    public ResponseEntity<BalanceAccount> createBalanceAccount(@Valid @RequestBody BalanceAccount balanceAccount) throws URISyntaxException {
        log.debug("REST request to save BalanceAccount : {}", balanceAccount);
        if (balanceAccount.getId() != null) {
            throw new BadRequestAlertException("A new balanceAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BalanceAccount result = balanceAccountRepository.save(balanceAccount);
        return ResponseEntity.created(new URI("/api/balance-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /balance-accounts : Updates an existing balanceAccount.
     *
     * @param balanceAccount the balanceAccount to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated balanceAccount,
     * or with status 400 (Bad Request) if the balanceAccount is not valid,
     * or with status 500 (Internal Server Error) if the balanceAccount couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/balance-accounts")
    public ResponseEntity<BalanceAccount> updateBalanceAccount(@Valid @RequestBody BalanceAccount balanceAccount) throws URISyntaxException {
        log.debug("REST request to update BalanceAccount : {}", balanceAccount);
        if (balanceAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BalanceAccount result = balanceAccountRepository.save(balanceAccount);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, balanceAccount.getId().toString()))
            .body(result);
    }

    /**
     * GET  /balance-accounts : get all the balanceAccounts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of balanceAccounts in body
     */
    @GetMapping("/balance-accounts")
    public List<BalanceAccount> getAllBalanceAccounts() {
        log.debug("REST request to get all BalanceAccounts");
        return balanceAccountRepository.findAll();
    }

    /**
     * GET  /balance-accounts/:id : get the "id" balanceAccount.
     *
     * @param id the id of the balanceAccount to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the balanceAccount, or with status 404 (Not Found)
     */
    @GetMapping("/balance-accounts/{id}")
    public ResponseEntity<BalanceAccount> getBalanceAccount(@PathVariable Long id) {
        log.debug("REST request to get BalanceAccount : {}", id);
        Optional<BalanceAccount> balanceAccount = balanceAccountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(balanceAccount);
    }

    /**
     * DELETE  /balance-accounts/:id : delete the "id" balanceAccount.
     *
     * @param id the id of the balanceAccount to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/balance-accounts/{id}")
    public ResponseEntity<Void> deleteBalanceAccount(@PathVariable Long id) {
        log.debug("REST request to delete BalanceAccount : {}", id);
        balanceAccountRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}